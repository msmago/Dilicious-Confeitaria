export type Category = 'Ovos de Colher' | 'Ovos Tradicionais & Infantis' | 'Kits & Degustação' | 'Lembrancinhas & Mimos';

export type OrderStatus = 'Novo' | 'Em Produção' | 'Pronto' | 'Entregue';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  active: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  deliveryType: 'Retirada' | 'Entrega';
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
  };
  preferredDate: string;
  preferredTime: 'manhã' | 'tarde' | 'noite';
  observations?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  reservationPaid: boolean;
  totalPaid: boolean;
  createdAt: string;
}

export type View = 'home' | 'menu' | 'checkout' | 'confirmation' | 'admin-login' | 'admin-orders' | 'admin-products';
