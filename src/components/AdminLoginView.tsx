import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Loader2, LogIn } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const AdminLoginView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (state.isAdminAuthenticated) {
      dispatch({ type: 'SET_VIEW', payload: 'admin-orders' });
    }
  }, [state.isAdminAuthenticated, dispatch]);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.email !== "lumariscontato@gmail.com") {
        setError('Acesso negado. Apenas o administrador pode acessar este painel.');
        await auth.signOut();
      }
    } catch (err: any) {
      console.error("Login Error Details: ", err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Este domínio não está autorizado no Firebase. Adicione o domínio atual nas configurações do Firebase Console.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('O pop-up de login foi bloqueado pelo seu navegador. Por favor, permita pop-ups para este site.');
      } else {
        setError('Erro ao realizar login. Verifique se o domínio está autorizado no Firebase Console.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md kraft-texture p-10 rounded-3xl border border-gold/20 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto border border-gold/20">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif text-gold">Acesso Restrito</h1>
          <p className="text-beige-satin/60 text-sm">Painel de Gestão Dilicious</p>
        </div>

        <div className="space-y-6">
          <p className="text-center text-beige-satin/60 text-sm leading-relaxed">
            Para acessar o painel administrativo, por favor realize o login com sua conta Google autorizada.
          </p>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20"
            >
              {error}
            </motion.p>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-gold text-chocolate-dark font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-beige-satin transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar com Google
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="text-xs text-beige-satin/40 hover:text-gold transition-colors"
          >
            Voltar para a Loja
          </button>
        </div>
      </motion.div>
    </div>
  );
};
