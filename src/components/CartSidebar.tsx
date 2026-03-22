import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useAppContext();

  const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-chocolate-dark border-l border-gold/20 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-gold/10 flex items-center justify-between bg-chocolate-bitter/30">
              <h2 className="text-2xl font-serif text-gold flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                Seu Carrinho
              </h2>
              <button onClick={onClose} className="min-touch-target p-2 hover:bg-gold/10 rounded-full transition-colors flex items-center justify-center">
                <X className="w-8 h-8 text-beige-satin" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {state.cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <ShoppingBag className="w-16 h-16 text-gold/30" />
                  <p className="text-lg font-serif italic">Seu carrinho está vazio.</p>
                  <button
                    onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'menu' }); onClose(); }}
                    className="text-gold hover:underline"
                  >
                    Explorar o cardápio
                  </button>
                </div>
              ) : (
                state.cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-gold/10 flex-shrink-0 bg-chocolate-bitter/30 flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gold/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-beige-satin truncate">{item.name}</h3>
                      <p className="text-gold font-medium">
                        {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gold/20 rounded-md overflow-hidden bg-chocolate-bitter/20">
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } })}
                            className="p-1 hover:bg-gold/10 text-gold transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                            className="p-1 hover:bg-gold/10 text-gold transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
                          className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-beige-satin">
                        {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {state.cart.length > 0 && (
              <div className="p-6 border-t border-gold/10 bg-chocolate-bitter/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-beige-satin/60">Subtotal</span>
                  <span className="text-xl font-serif text-gold">
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <button
                  onClick={() => { dispatch({ type: 'SET_VIEW', payload: 'checkout' }); onClose(); }}
                  className="w-full py-4 bg-gold text-chocolate-dark font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-beige-satin transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Finalizar Pedido
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
