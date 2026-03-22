import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, Order, CartItem, View, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../constants';
import { db, auth } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AppState {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  currentView: View;
  isAdminAuthenticated: boolean;
  lastOrder: Order | null;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'SET_LAST_ORDER'; payload: Order }
  | { type: 'SET_ADMIN_AUTH'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean };

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ).filter(item => item.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_LAST_ORDER':
      return { ...state, lastOrder: action.payload, cart: [], currentView: 'confirmation' };
    case 'SET_ADMIN_AUTH':
      return { ...state, isAdminAuthenticated: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    products: [],
    orders: [],
    cart: [],
    currentView: 'home',
    isAdminAuthenticated: false,
    lastOrder: null,
    loading: true
  });

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if user is the admin email
      const isAdmin = user?.email === "lumariscontato@gmail.com" && user?.emailVerified;
      dispatch({ type: 'SET_ADMIN_AUTH', payload: !!isAdmin });
    });
    return () => unsubscribe();
  }, []);

  // Products Listener
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return { ...data, id: doc.id } as Product;
      });
      
      dispatch({ type: 'SET_PRODUCTS', payload: productsData });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, (error) => {
      console.error("Firestore Products Error: ", error);
      dispatch({ type: 'SET_LOADING', payload: false });
    });
    return () => unsubscribe();
  }, []);

  // Migration logic (only for admin)
  useEffect(() => {
    if (state.isAdminAuthenticated && state.products.length === 0 && !state.loading) {
      const migrate = async () => {
        try {
          for (const product of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', product.id), product);
          }
        } catch (err) {
          console.error("Migration Error: ", err);
        }
      };
      migrate();
    }
  }, [state.isAdminAuthenticated, state.products.length, state.loading]);

  // Orders Listener (only for admin)
  useEffect(() => {
    if (!state.isAdminAuthenticated) {
      dispatch({ type: 'SET_ORDERS', payload: [] });
      return;
    }

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => doc.data() as Order);
      dispatch({ type: 'SET_ORDERS', payload: ordersData });
    }, (error) => {
      console.error("Firestore Orders Error: ", error);
    });
    return () => unsubscribe();
  }, [state.isAdminAuthenticated]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
