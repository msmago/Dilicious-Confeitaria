import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Truck, Store, Calendar, Clock, CreditCard, Loader2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Order } from '../types';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firestore';

export const CheckoutView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    deliveryType: 'Retirada' as 'Retirada' | 'Entrega',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    preferredDate: '',
    preferredTime: 'manhã' as 'manhã' | 'tarde' | 'noite',
    observations: ''
  });

  const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = formData.deliveryType === 'Entrega' ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const orderId = `PAQ-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const newOrder: Order = {
      id: orderId,
      customerName: formData.customerName,
      phone: formData.phone,
      deliveryType: formData.deliveryType,
      address: formData.deliveryType === 'Entrega' ? {
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        complement: formData.complement
      } : undefined,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
      observations: formData.observations,
      items: state.cart,
      subtotal,
      deliveryFee,
      total,
      status: 'Novo',
      reservationPaid: false,
      totalPaid: false,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
      dispatch({ type: 'SET_LAST_ORDER', payload: newOrder });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders/${orderId}`);
      setError('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Min date: today + 2 days
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
        className="flex items-center gap-2 text-gold hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar ao cardápio
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-4xl font-serif text-gold">Finalizar Pedido</h1>

          <div className="bg-gold/10 border border-gold p-6 rounded-2xl space-y-3">
            <h3 className="font-serif text-lg text-gold flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Política de Reserva
            </h3>
            <p className="text-sm text-beige-satin/80 leading-relaxed">
              Para confirmar sua reserva, é necessário o pagamento antecipado de <strong>50% do valor total</strong>. 
              Os 50% restantes são pagos no momento da retirada ou entrega. 
              Formas de pagamento aceitas: <strong>PIX e Cartão de Crédito (via PicPay)</strong>.
              Encomendas limitadas até o dia <strong>30/03</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="kraft-texture p-8 rounded-2xl border border-gold/10 space-y-6">
              <h2 className="text-xl font-serif text-beige-satin border-b border-gold/10 pb-2">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-beige-satin/60">Nome Completo *</label>
                  <input
                    required
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-beige-satin/60">WhatsApp *</label>
                  <input
                    required
                    name="phone"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all"
                    placeholder="(99) 99999-9999"
                  />
                </div>
              </div>
            </div>

            <div className="kraft-texture p-8 rounded-2xl border border-gold/10 space-y-6">
              <h2 className="text-xl font-serif text-beige-satin border-b border-gold/10 pb-2">Entrega ou Retirada</h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'Retirada' }))}
                  className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    formData.deliveryType === 'Retirada'
                      ? 'bg-gold/20 border-gold text-gold'
                      : 'border-gold/10 text-beige-satin/40 hover:border-gold/30'
                  }`}
                >
                  <Store className="w-6 h-6" />
                  <span className="font-bold">Retirada</span>
                  <span className="text-[10px] uppercase">Grátis</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'Entrega' }))}
                  className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                    formData.deliveryType === 'Entrega'
                      ? 'bg-gold/20 border-gold text-gold'
                      : 'border-gold/10 text-beige-satin/40 hover:border-gold/30'
                  }`}
                >
                  <Truck className="w-6 h-6" />
                  <span className="font-bold">Entrega</span>
                  <span className="text-[10px] uppercase">R$ 5,00</span>
                </button>
              </div>

              {formData.deliveryType === 'Entrega' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm text-beige-satin/60">Rua/Logradouro *</label>
                      <input
                        required
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-beige-satin/60">Número *</label>
                      <input
                        required
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-beige-satin/60">Bairro *</label>
                      <input
                        required
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleInputChange}
                        className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-beige-satin/60">Complemento</label>
                      <input
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="kraft-texture p-8 rounded-2xl border border-gold/10 space-y-6">
              <h2 className="text-xl font-serif text-beige-satin border-b border-gold/10 pb-2">Agendamento</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-beige-satin/60 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Data de Entrega/Retirada *
                  </label>
                  <select
                    required
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all text-beige-satin"
                  >
                    <option value="">Selecione uma data</option>
                    <option value="2026-04-03">03/04/2026 (Sexta-feira)</option>
                    <option value="2026-04-04">04/04/2026 (Sábado)</option>
                    <option value="2026-04-05">05/04/2026 (Domingo de Páscoa)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-beige-satin/60 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Período *
                  </label>
                  <select
                    required
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all text-beige-satin"
                  >
                    <option value="manhã">Manhã (08h - 12h)</option>
                    <option value="tarde">Tarde (12h - 18h)</option>
                    <option value="noite">Noite (18h - 21h)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-beige-satin/60">Observações Adicionais</label>
                <textarea
                  name="observations"
                  value={formData.observations}
                  onChange={handleInputChange}
                  maxLength={300}
                  rows={3}
                  className="w-full bg-chocolate-dark border border-gold/20 rounded-lg p-3 focus:border-gold outline-none transition-all resize-none"
                  placeholder="Ex: Alergias, embalagem para presente, etc."
                />
                <div className="text-right text-[10px] text-beige-satin/40">
                  {formData.observations.length}/300
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Summary Column */}
        <div className="lg:sticky lg:top-32 h-fit pb-24 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-chocolate-bitter/40 rounded-2xl border border-gold/20 overflow-hidden shadow-2xl"
          >
            <div className="p-6 bg-gold/10 border-b border-gold/10">
              <h2 className="text-2xl font-serif text-gold flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                Resumo do Pedido
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                {state.cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-gold font-bold">{item.quantity}x</span>
                      <span className="text-beige-satin/80 truncate max-w-[120px] sm:max-w-[200px]">{item.name}</span>
                    </div>
                    <span className="text-beige-satin font-medium">
                      {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gold/10">
                <div className="flex justify-between text-sm text-beige-satin/60">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-sm text-beige-satin/60">
                  <span>Taxa de Entrega</span>
                  <span>{deliveryFee === 0 ? 'Grátis' : deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-xl font-serif text-gold pt-2">
                  <span>Total</span>
                  <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gold/10">
                <div className="flex justify-between text-sm font-bold text-gold">
                  <span>Valor da reserva (50%)</span>
                  <span>{(total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between text-sm text-beige-satin/60 italic">
                  <span>Restante na entrega (50%)</span>
                  <span>{(total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>

              <div className="bg-gold/5 p-4 rounded-lg border border-gold/10 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Pagamento</p>
                <p className="text-xs text-beige-satin/70 leading-relaxed">
                  O pagamento é realizado via PIX após a confirmação do pedido. Você receberá as instruções na próxima tela.
                </p>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-chocolate-dark border-t border-gold/20 lg:relative lg:p-0 lg:bg-transparent lg:border-none z-40">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || state.cart.length === 0 || !formData.customerName || !formData.phone || !formData.preferredDate}
                  className="w-full py-5 bg-gold text-chocolate-dark font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-beige-satin transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-2xl shadow-gold/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Pedido
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
