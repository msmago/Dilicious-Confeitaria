import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, MessageSquare, ArrowLeft, Download, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const ConfirmationView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const order = state.lastOrder;

  if (!order) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
        <ShoppingBag className="w-16 h-16 text-gold/30" />
        <p className="text-xl font-serif italic text-beige-satin/60">Nenhum pedido encontrado.</p>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="px-8 py-3 bg-gold text-chocolate-dark font-bold rounded-lg"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  const whatsappMessage = `Olá! Acabei de fazer um pedido na Dilicious Confeitaria.%0A%0A*Pedido:* ${order.id}%0A*Cliente:* ${order.customerName}%0A*Total:* ${order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}%0A*Entrega:* ${order.deliveryType}%0A*Data:* ${order.preferredDate}%0A%0A*Itens:*%0A${order.items.map(item => `- ${item.quantity}x ${item.name}`).join('%0A')}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-gold">Pedido Confirmado!</h1>
          <p className="text-beige-satin/60">Sua doçura de Páscoa já está em nossa fila de produção.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="kraft-texture p-8 rounded-3xl border border-gold/20 shadow-2xl space-y-8"
      >
        <div className="flex justify-between items-start border-b border-gold/10 pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Número do Pedido</p>
            <h2 className="text-2xl font-serif text-beige-satin">{order.id}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold mb-1">Data do Pedido</p>
            <p className="text-beige-satin/80">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-xl text-gold">Resumo do Pedido</h3>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-beige-satin/80">{item.quantity}x {item.name}</span>
                <span className="text-beige-satin">{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-gold/10 space-y-2">
              <div className="flex justify-between text-sm text-beige-satin/60">
                <span>Subtotal</span>
                <span>{order.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between text-sm text-beige-satin/60">
                <span>Taxa de Entrega ({order.deliveryType})</span>
                <span>{order.deliveryFee === 0 ? 'Grátis' : order.deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="flex justify-between text-2xl font-serif text-gold pt-2">
                <span>Total</span>
                <span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-chocolate-bitter/40 p-6 rounded-2xl border border-gold/10 space-y-4">
          <h3 className="font-serif text-lg text-gold">Instruções de Pagamento</h3>
          <div className="space-y-4 text-sm text-beige-satin/80">
            <div className="flex justify-between items-center bg-gold/10 p-4 rounded-xl border border-gold/20">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Valor da Reserva (50%)</p>
                <p className="text-2xl font-serif text-gold">{(order.total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-beige-satin/40 font-bold">Saldo Restante</p>
                <p className="text-lg font-serif text-beige-satin/60">{(order.total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
            </div>
            
            <p>Realize o pagamento da reserva via PIX para garantir sua encomenda:</p>
            <div className="bg-chocolate-dark p-3 rounded border border-gold/20 flex items-center justify-between">
              <code className="text-gold font-bold">viniciuspatricio82@gmail.com</code>
              <button 
                onClick={() => navigator.clipboard.writeText('viniciuspatricio82@gmail.com')}
                className="text-[10px] uppercase text-gold hover:underline"
              >
                Copiar Chave
              </button>
            </div>
            <p className="text-xs italic opacity-60">* Envie o comprovante pelo WhatsApp após o pagamento. Os 50% restantes serão pagos no ato da {order.deliveryType.toLowerCase()}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <a
            href={`https://wa.me/558396835414?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:opacity-90 transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            Enviar no WhatsApp
          </a>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="flex items-center justify-center gap-2 py-4 border border-gold/30 text-gold font-bold rounded-xl hover:bg-gold/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Fazer novo pedido
          </button>
        </div>
      </motion.div>
    </div>
  );
};
