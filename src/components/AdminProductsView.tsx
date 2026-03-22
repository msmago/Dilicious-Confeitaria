import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Save,
  ArrowLeft,
  Package,
  LogOut,
  ToggleLeft,
  ToggleRight,
  Upload,
  Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Product, Category } from '../types';
import { CATEGORIES } from '../constants';
import { db, storage } from '../firebase';
import { collection, setDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore';
import imageCompression from 'browser-image-compression';

export const AdminProductsView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: CATEGORIES[0],
    image: '',
    active: true
  });
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleOpenModal = (product?: Product) => {
    setErrorMsg(null);
    setLocalPreview(product?.image || null);
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: CATEGORIES[0],
        image: '',
        active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image && !isUploading && !isCompressing) {
      setErrorMsg('Por favor, adicione uma foto para o produto.');
      return;
    }

    if (isUploading || isCompressing) {
      setErrorMsg('Aguarde o processamento da imagem ser concluído.');
      return;
    }

    try {
      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id);
        await updateDoc(productRef, formData);
      } else {
        const productsRef = collection(db, 'products');
        const newDocRef = doc(productsRef);
        const newProduct = {
          ...formData,
          id: newDocRef.id,
          active: true
        };
        await setDoc(newDocRef, newProduct);
      }
      setIsModalOpen(false);
      setLocalPreview(null);
    } catch (err) {
      handleFirestoreError(err, editingProduct ? OperationType.UPDATE : OperationType.CREATE, editingProduct ? `products/${editingProduct.id}` : 'products');
      setErrorMsg('Erro ao salvar produto. Verifique as permissões ou os dados.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProductToDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      setErrorMsg('Erro ao excluir produto. Tente novamente.');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await updateDoc(doc(db, 'products', product.id), { active: !product.active });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${product.id}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor, selecione uma imagem válida (JPG, PNG, etc).');
      return;
    }

    // Show local preview immediately (very fast)
    const reader = new FileReader();
    reader.onload = (event) => {
      setLocalPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsCompressing(true);
    setErrorMsg(null);

    try {
      // Step 1: Initial compression/resize
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: 0.7,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Step 2: Convert to WebP for maximum efficiency
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Falha na conversão WebP'));
          }, 'image/webp', 0.6);
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
        img.src = URL.createObjectURL(compressedFile);
      });

      setIsCompressing(false);
      setIsUploading(true);
      setUploadProgress(0);

      // Step 3: Direct upload to Firebase Storage (Vercel-compatible)
      const fileName = `${Date.now()}_${file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}.webp`;
      const storageRef = ref(storage, `products/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, webpBlob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setErrorMsg('Erro no upload. Tente novamente.');
          setIsUploading(false);
          setUploadProgress(null);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setFormData((prev) => ({ ...prev, image: downloadURL }));
            setIsUploading(false);
            setUploadProgress(null);
          } catch (urlErr) {
            setErrorMsg('Erro ao finalizar o upload.');
            setIsUploading(false);
          }
        }
      );
    } catch (error) {
      console.error('Process error:', error);
      setErrorMsg('Erro ao processar imagem.');
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-gold">Gestão de Produtos</h1>
          <p className="text-beige-satin/60">Controle o estoque e visibilidade do cardápio</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin-orders' })}
            className="px-6 py-2 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Pedidos
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-2 bg-gold text-chocolate-dark font-bold rounded-lg hover:bg-beige-satin transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Products List (Table on Desktop, Cards on Mobile) */}
      <div className="bg-chocolate-bitter/20 rounded-2xl border border-gold/10 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gold/5 border-b border-gold/10">
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Produto</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Categoria</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Preço</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Status</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {state.products.map(product => (
                <tr key={product.id} className="hover:bg-gold/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold/10 flex-shrink-0 bg-chocolate-bitter/30 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-gold/20" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-beige-satin">{product.name}</p>
                        <p className="text-[10px] text-beige-satin/40 line-clamp-1 max-w-xs">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-xs text-beige-satin/60">{product.category}</span>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-serif text-gold">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => handleToggleActive(product)}
                      className={`flex items-center gap-2 text-xs font-bold transition-all ${
                        product.active ? 'text-green-400' : 'text-beige-satin/30'
                      }`}
                    >
                      {product.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      {product.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-chocolate-dark transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-gold/10">
          {state.products.map(product => (
            <div key={product.id} className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gold/10 flex-shrink-0 bg-chocolate-bitter/30 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gold/20" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-lg font-serif text-beige-satin">{product.name}</p>
                  <p className="text-xs text-beige-satin/40">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-serif text-gold">
                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleToggleActive(product)}
                  className={`flex items-center gap-2 text-xs font-bold transition-all ${
                    product.active ? 'text-green-400' : 'text-beige-satin/30'
                  }`}
                >
                  {product.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  {product.active ? 'Ativo no Cardápio' : 'Inativo no Cardápio'}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="p-3 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-chocolate-dark transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductToDelete(product.id)}
                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-chocolate-dark border border-gold/20 rounded-3xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-chocolate-bitter/30">
                <h2 className="text-2xl font-serif text-gold">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gold/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {errorMsg && (
                <div className="mx-8 mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold">Nome do Produto *</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-chocolate-dark border border-gold/20 rounded-xl p-3 focus:border-gold outline-none transition-all text-beige-satin"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold">Descrição *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-chocolate-dark border border-gold/20 rounded-xl p-3 focus:border-gold outline-none transition-all text-beige-satin resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold">Preço (BRL) *</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full bg-chocolate-dark border border-gold/20 rounded-xl p-3 focus:border-gold outline-none transition-all text-beige-satin"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold">Categoria *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full bg-chocolate-dark border border-gold/20 rounded-xl p-3 focus:border-gold outline-none transition-all text-beige-satin"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-gold font-bold">Imagem do Produto *</label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Upload Area */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                            isUploading 
                              ? 'border-gold/20 bg-gold/5 cursor-not-allowed' 
                              : 'border-gold/30 hover:border-gold hover:bg-gold/5'
                          }`}
                        >
                          {isCompressing ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-8 h-8 text-gold animate-spin" />
                              <span className="text-[10px] text-gold font-bold uppercase tracking-widest">Processando...</span>
                            </div>
                          ) : isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="w-8 h-8 text-gold animate-spin" />
                              <span className="text-xs text-gold font-bold">{Math.round(uploadProgress || 0)}%</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-gold/40 mb-2" />
                              <span className="text-xs text-beige-satin/60 font-medium">Clique para enviar foto</span>
                            </>
                          )}
                        </label>
                      </div>

                      {/* Preview Area */}
                      <div className="h-32 rounded-2xl border border-gold/20 overflow-hidden bg-chocolate-bitter/30 flex items-center justify-center relative group">
                        {localPreview ? (
                          <>
                            <img 
                              src={localPreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                                {isCompressing ? 'Processando...' : isUploading ? 'Enviando...' : 'Visualização'}
                              </span>
                            </div>
                          </>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gold/10" />
                        )}
                      </div>
                    </div>

                    {/* Fallback URL Option */}
                    <div className="space-y-2 pt-2 border-t border-gold/10">
                      <label className="text-[10px] uppercase tracking-widest text-gold/40 font-bold">
                        Opção B: Colar link da foto (se o upload acima falhar)
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40" />
                        <input
                          value={formData.image}
                          onChange={(e) => {
                            setFormData({ ...formData, image: e.target.value });
                            setLocalPreview(e.target.value);
                          }}
                          className="w-full bg-chocolate-dark border border-gold/20 rounded-xl p-2 pl-9 focus:border-gold outline-none transition-all text-beige-satin text-xs"
                          placeholder="https://link-da-foto.com/imagem.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-4 bg-gold text-chocolate-dark font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-beige-satin transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Aguarde o Upload...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Salvar Produto
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 border border-gold/20 text-beige-satin/60 rounded-xl hover:bg-gold/5 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProductToDelete(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-chocolate-dark border border-gold/20 rounded-3xl z-[60] overflow-hidden shadow-2xl p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 mx-auto border border-red-500/20">
                <Trash2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-gold">Excluir Produto?</h3>
                <p className="text-beige-satin/60 text-sm">Esta ação não pode ser desfeita e removerá o item permanentemente do cardápio.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(productToDelete)}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 border border-gold/20 text-beige-satin/60 rounded-xl hover:bg-gold/5 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
