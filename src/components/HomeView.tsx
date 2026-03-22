import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Plus, ChevronRight, Calendar, Truck, CreditCard, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES } from '../constants';

export const HomeView: React.FC = () => {
  const { state, dispatch } = useAppContext();

  const featuredProducts = state.products.filter(p => p.active).slice(0, 3);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://image2url.com/r2/default/images/1773013971723-169db926-e67a-4910-8eed-3032eccecbda.blob"
            alt="Luxury Easter Chocolate"
            className="w-full h-full object-cover object-center scale-105"
            referrerPolicy="no-referrer"
          />
          <div 
            className="absolute inset-0" 
            style={{ background: 'linear-gradient(to bottom, rgba(26,18,8,0.5) 0%, rgba(26,18,8,0.88) 100%)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <h1 className="text-5xl sm:text-8xl font-serif leading-tight text-beige-satin">
              Páscoa <br />
              <span className="text-gold italic">Artesanal</span>
            </h1>
            
            <div className="relative pl-6 border-l-2 border-gold py-2">
              <blockquote className="text-xl sm:text-2xl font-serif text-beige-satin italic leading-relaxed">
                "O chocolate é a linguagem universal da felicidade, e na Páscoa, ele se torna poesia."
              </blockquote>
              <cite className="text-gold mt-2 block font-serif text-sm not-italic opacity-80">— Chef Confeiteira</cite>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
                className="min-touch-target px-8 py-4 bg-gold text-chocolate-dark font-bold rounded-lg flex items-center gap-2 hover:bg-beige-satin transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-gold/10"
              >
                Ver Cardápio Completo
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Info Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="kraft-texture p-8 sm:p-12 rounded-3xl border border-gold/20 shadow-2xl space-y-8 text-center"
        >
          <h2 className="text-3xl font-serif text-gold">Informações Importantes</h2>
          <div className="w-16 h-px bg-gold/30 mx-auto" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gold font-bold text-xs uppercase tracking-wider">Prazos</p>
                  <p className="text-beige-satin/80 text-sm">Encomendas limitadas até o dia <strong>30/03</strong>.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 mt-1">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gold font-bold text-xs uppercase tracking-wider">Entregas</p>
                  <p className="text-beige-satin/80 text-sm">Realizadas nos dias <strong>03, 04 e 05/04</strong>.</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 mt-1">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gold font-bold text-xs uppercase tracking-wider">Pagamento</p>
                  <p className="text-beige-satin/80 text-sm">PIX ou Cartão de Crédito (PicPay). Reserva de 50% no ato do pedido.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold flex-shrink-0 mt-1">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gold font-bold text-xs uppercase tracking-wider">Contato</p>
                  <p className="text-beige-satin/80 text-sm">(83) 99683-5414 | @Diliciousconfeitaria</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-gold mb-4">Nossas Coleções</h2>
          <div className="w-24 h-px bg-gold/30 mx-auto mb-6" />
          <p className="text-beige-satin/60 italic max-w-xl mx-auto">
            Descubra a excelência em cada detalhe de nossa seleção exclusiva para esta Páscoa.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
              className="group relative w-[calc(50%-1rem)] sm:w-72 h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer border border-gold/10 hover:border-gold/40 transition-all"
            >
              <div className="absolute inset-0 bg-chocolate-bitter/40 group-hover:bg-chocolate-bitter/20 transition-colors z-10" />
              <div className="absolute inset-0 kraft-texture opacity-30 group-hover:opacity-10 transition-opacity" />
              
              <div className="relative z-20 h-full flex flex-col items-center justify-center p-6 text-center">
                <span className="text-gold/40 text-xs tracking-[0.3em] uppercase mb-2">Coleção</span>
                <h3 className="font-serif text-2xl text-beige-satin group-hover:text-gold group-hover:scale-110 transition-all duration-500">
                  {cat}
                </h3>
                <div className="mt-4 w-0 group-hover:w-12 h-px bg-gold transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif text-gold mb-2">Mais Pedidos</h2>
            <p className="text-beige-satin/60 italic">Os favoritos da nossa chocolatier</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
            className="text-gold hover:underline flex items-center gap-2"
          >
            Ver todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-chocolate-bitter/30 rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all"
            >
              <div className="h-64 overflow-hidden relative bg-chocolate-bitter/30 flex items-center justify-center">
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
                <div className="absolute top-4 right-4 bg-chocolate-dark/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold/20 text-gold text-xs font-bold">
                  Destaque
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-serif text-beige-satin">{product.name}</h3>
                <p className="text-beige-satin/60 text-sm line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-serif text-gold">
                    {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <button
                    onClick={() => dispatch({ type: 'ADD_TO_CART', payload: product })}
                    className="p-3 bg-gold/10 text-gold rounded-full hover:bg-gold hover:text-chocolate-dark transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
