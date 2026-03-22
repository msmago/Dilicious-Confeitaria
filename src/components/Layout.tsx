import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Instagram, Facebook, Phone } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Navbar: React.FC<{ onOpenCart: () => void }> = ({ onOpenCart }) => {
  const { state, dispatch } = useAppContext();
  const cartCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-chocolate-dark/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          >
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-chocolate-dark font-serif font-bold text-xl group-hover:rotate-12 transition-transform">
              D
            </div>
            <span className="text-xl sm:text-2xl font-serif text-gold tracking-tight">
              Dilicious <span className="italic text-beige-satin hidden xs:inline">Confeitaria</span>
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'menu' })}
              className="text-beige-satin hover:text-gold font-medium transition-colors hidden sm:block"
            >
              Cardápio
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: state.isAdminAuthenticated ? 'admin-orders' : 'admin-login' })}
              className="p-2 text-beige-satin hover:text-gold transition-colors"
              title="Painel Admin"
            >
              <User className="w-6 h-6" />
            </button>
            <button
              onClick={onOpenCart}
              className="relative p-2 text-beige-satin hover:text-gold transition-colors group"
            >
              <ShoppingBag className="w-6 h-6" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-gold text-chocolate-dark text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-chocolate-dark"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-chocolate-bitter/50 border-t border-gold/10 pt-16 pb-8 safe-bottom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-start">
          <div className="space-y-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-chocolate-dark font-serif font-bold text-lg">
                D
              </div>
              <span className="text-xl font-serif text-gold tracking-tight">
                Dilicious <span className="italic text-beige-satin">Confeitaria</span>
              </span>
            </div>
            <p className="text-beige-satin/60 text-sm leading-relaxed max-w-xs">
              Artesania em chocolate para momentos inesquecíveis. Cada peça é uma obra de arte feita à mão com os melhores ingredientes do mundo.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-gold font-serif text-lg mb-6">Atendimento</h4>
            <ul className="space-y-3 text-sm text-beige-satin/70">
              <li>Segunda - Sexta: 09h às 19h</li>
              <li>Sábado: 10h às 18h</li>
              <li>WhatsApp: (83) 9683-5414</li>
            </ul>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="text-gold font-serif text-lg mb-6">Siga-nos</h4>
            <div className="flex gap-4">
              <a href="#" className="min-touch-target p-2 bg-gold/10 rounded-full text-gold hover:bg-gold hover:text-chocolate-dark transition-all flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="min-touch-target p-2 bg-gold/10 rounded-full text-gold hover:bg-gold hover:text-chocolate-dark transition-all flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://wa.me/558396835414" className="min-touch-target p-2 bg-gold/10 rounded-full text-gold hover:bg-gold hover:text-chocolate-dark transition-all flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/5 pt-8 text-center text-xs text-beige-satin/40">
          <p>© 2026 Dilicious Confeitaria. Todos os direitos reservados. Feito com amor para a Páscoa. 🍫</p>
        </div>
      </div>
    </footer>
  );
};
