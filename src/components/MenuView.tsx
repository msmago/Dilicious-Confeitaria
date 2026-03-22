import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES } from '../constants';
import { Category, Product } from '../types';

export const MenuView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [addedFeedback, setAddedFeedback] = useState<string | null>(null);

  const filteredProducts = state.products.filter(p =>
    p.active && (selectedCategory === 'Todos' || p.category === selectedCategory)
  );

  const handleAddToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    setAddedFeedback(product.id);
    setTimeout(() => setAddedFeedback(null), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-gold">Nosso Cardápio</h1>
        <p className="text-beige-satin/60 italic max-w-2xl mx-auto">
          Explore nossa seleção exclusiva de Páscoa. Cada item é produzido artesanalmente em pequenos lotes para garantir a máxima qualidade.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar sm:justify-center px-4 -mx-4">
        <button
          onClick={() => setSelectedCategory('Todos')}
          className={`px-8 py-3 rounded-full border transition-all whitespace-nowrap font-serif tracking-wide text-sm sm:text-base ${
            selectedCategory === 'Todos'
              ? 'bg-gold border-gold text-chocolate-dark font-bold shadow-lg shadow-gold/20'
              : 'border-gold/20 text-beige-satin hover:border-gold/50 bg-chocolate-bitter/20'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-full border transition-all whitespace-nowrap font-serif tracking-wide text-sm sm:text-base ${
              selectedCategory === cat
                ? 'bg-gold border-gold text-chocolate-dark font-bold shadow-lg shadow-gold/20'
                : 'border-gold/20 text-beige-satin hover:border-gold/50 bg-chocolate-bitter/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => {
            const cartItem = state.cart.find(item => item.id === product.id);
            const isAdded = addedFeedback === product.id;

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-chocolate-bitter/20 rounded-2xl border border-gold/10 hover:border-gold/40 transition-all flex flex-col h-full"
              >
                <div className="aspect-square overflow-hidden relative bg-chocolate-bitter/30 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Plus className="w-12 h-12 text-gold/10" />
                  )}
                  <div className="absolute top-3 left-3 bg-chocolate-dark/70 backdrop-blur-md px-2 py-1 rounded text-[10px] uppercase tracking-widest text-gold font-bold border border-gold/20">
                    {product.category}
                  </div>
                  {cartItem && (
                    <div className="absolute top-3 right-3 bg-gold text-chocolate-dark w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {cartItem.quantity}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <h3 className="text-xl font-serif text-beige-satin leading-tight">{product.name}</h3>
                  <p className="text-beige-satin/50 text-sm line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-serif text-gold font-bold">
                      {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdded}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                        isAdded
                          ? 'bg-green-600 text-white'
                          : 'bg-gold text-chocolate-dark hover:bg-beige-satin'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-xs">Adicionado</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span className="text-xs">Adicionar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-24 text-center space-y-4 opacity-40">
          <ShoppingBag className="w-16 h-16 mx-auto text-gold/30" />
          <p className="text-xl font-serif italic">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};
