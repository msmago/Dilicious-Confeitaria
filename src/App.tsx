/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar, Footer } from './components/Layout';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { CheckoutView } from './components/CheckoutView';
import { ConfirmationView } from './components/ConfirmationView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminOrdersView } from './components/AdminOrdersView';
import { AdminProductsView } from './components/AdminProductsView';
import { CartSidebar } from './components/CartSidebar';

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.currentView]);

  const renderView = () => {
    switch (state.currentView) {
      case 'home': return <HomeView />;
      case 'menu': return <MenuView />;
      case 'checkout': return <CheckoutView />;
      case 'confirmation': return <ConfirmationView />;
      case 'admin-login': return <AdminLoginView />;
      case 'admin-orders': return state.isAdminAuthenticated ? <AdminOrdersView /> : <AdminLoginView />;
      case 'admin-products': return state.isAdminAuthenticated ? <AdminProductsView /> : <AdminLoginView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/558396835414"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 p-4 bg-[#25D366] text-white rounded-full shadow-2xl shadow-green-500/20 animate-pulse-soft group mb-[env(safe-area-inset-bottom)]"
      >
        <MessageSquare className="w-8 h-8" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-chocolate-dark border border-gold/20 text-gold text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
          Fale conosco
        </span>
      </a>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
