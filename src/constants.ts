import { Product, Order, Category } from './types';

export const CATEGORIES: Category[] = [
  'Ovos de Colher',
  'Ovos Tradicionais & Infantis',
  'Kits & Degustação',
  'Lembrancinhas & Mimos'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ovo de Colher Brigadeiro (350g)',
    description: 'Casca blend, brigadeiro cremoso 50% cacau, decorado com granulado. Peso final aprox. 600g.',
    price: 75.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '2',
    name: 'Ovo de Colher Ninho (350g)',
    description: 'Casca Blend, creme de leite ninho, brigadeiro cremoso de leite ninho, decorado com leite ninho em pó. Peso final aprox. 600g.',
    price: 75.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '3',
    name: 'Ovo de Colher Dois Amores (350g)',
    description: 'Casca Blend, creme de leite ninho, brigadeiro cremoso 50% cacau, decorado com brigadeiro cremoso de leite ninho e finalizado com granulado. Peso final aprox. 600g.',
    price: 75.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '4',
    name: 'Ovo de Colher Ninho com Morangos (350g)',
    description: 'Casca Blend, creme de leite ninho, morangos picados, brigadeiro cremoso de leite ninho, decorado com morangos. Peso final aprox. 600g.',
    price: 85.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '5',
    name: 'Ovo de Colher Ninho com Nutella (350g)',
    description: 'Casca Blend, Nutella pura, brigadeiro cremoso de leite ninho, decorado com brigadeiros de leite ninho com Nutella. Peso final aprox. 600g.',
    price: 85.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '6',
    name: 'Ovo de Colher Laka Oreo (350g)',
    description: 'Casca branca com pedaços de biscoito oreo, Nutella, brigadeiro cremoso de Oreo, decorado brigadeiro cremoso de ninho, biscoitos oreo e pedaços de Laka Oreo. Peso final aprox. 600g.',
    price: 85.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1523293915678-d1268a8e6400?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '7',
    name: 'Ovo de Colher Ferrero Rocher (350g)',
    description: 'Casca Blend, brigadeiro cremoso 50% cacau, Nutella pura, amendoim granulado, decorado com Ferrero Rocher e amendoim. Peso final aprox. 600g.',
    price: 85.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '8',
    name: 'Ovo de Colher Torta de Limão (350g)',
    description: 'Casca branca com pedaços de biscoito maisena, farofa crocante de biscoito maisena, mousse de limão, decorado com chantininho e raspas de limão. Peso final aprox. 600g.',
    price: 85.00,
    category: 'Ovos de Colher',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '9',
    name: 'Ovo 150g',
    description: 'Casca Blend, branca com pedaços de biscoito Oreo ou branca com biscoito maisena. Recheios: Qualquer um disponível no cardápio. Adicional de morango (+ R$ 3,00). Pesando até 250g.',
    price: 35.00,
    category: 'Ovos Tradicionais & Infantis',
    image: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '10',
    name: 'Dupla Ovos 150g',
    description: 'Até 2 sabores. Casca Blend, branca com pedaços de biscoito Oreo ou branca com biscoito maisena. Recheios: Qualquer um disponível no cardápio. Pesando até 450g.',
    price: 70.00,
    category: 'Ovos Tradicionais & Infantis',
    image: 'https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '11',
    name: 'Ovo Fini 150g (Infantil)',
    description: 'Casca Blend, recheio de brigadeiro cremoso branco ou chocolate 50% cacau, decorado com variedades de fini e confete. Pesando até 250g.',
    price: 40.00,
    category: 'Ovos Tradicionais & Infantis',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '12',
    name: 'Kit Mini Chef',
    description: 'Casca Blend ou branca com pedaços de biscoito Oreo, recheio de brigadeiro cremoso de ninho ou chocolate 50% cacau, tubetes (confetes e granulado colorido), marshmallow e finis para decorar. Peso final de até 200g.',
    price: 40.00,
    category: 'Kits & Degustação',
    image: 'https://images.unsplash.com/photo-1523293915678-d1268a8e6400?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '13',
    name: 'Kit Degustação',
    description: 'Até 4 sabores. Casca Blend ou branca com pedaços de biscoito Oreo. Recheios: Brigadeiro; Ninho; Torta de Limão; Ninho com Nutella; Ninho com Morango; Oreo e Ferrero Rocher. Pesando até 220g.',
    price: 35.00,
    category: 'Kits & Degustação',
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '14',
    name: 'Kit Degustação Infantil',
    description: '4 sabores. Casca Blend e 1 branca com pedaços de biscoito Oreo. Recheios: Brigadeiro; Ninho; 2 amores e Oreo. Todos decorados (Confete, Marshmallow; Mini Oreo e Fini). Pesando até 220g.',
    price: 38.00,
    category: 'Kits & Degustação',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '15',
    name: 'Barra Recheada',
    description: 'Sabores: Dois amores, Ninho, Ninho com Nutella, Brigadeiro, Ferrero Rocher, Oreo.',
    price: 25.00,
    category: 'Lembrancinhas & Mimos',
    image: 'https://images.unsplash.com/photo-1516684669134-de6f7c473a2a?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '16',
    name: 'Cone Trufado',
    description: 'Cobertura chocolate ou branca com pedaços de biscoito Oreo. Recheios: Brigadeiro, Beijinho ou Oreo.',
    price: 12.00,
    category: 'Lembrancinhas & Mimos',
    image: 'https://images.unsplash.com/photo-1589113103503-49ef83d89e70?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '17',
    name: 'Mini Joy Stick',
    description: 'Casca Blend. Recheios: Dois amores. Pesando até 120g.',
    price: 15.00,
    category: 'Lembrancinhas & Mimos',
    image: 'https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '18',
    name: 'Dupla mini ovos 50g',
    description: 'Até 2 sabores. Casca Blend ou branca com pedaços de biscoito Oreo. Recheios: Todos do Cardápio. Pesando até 120g.',
    price: 12.00,
    category: 'Lembrancinhas & Mimos',
    image: 'https://images.unsplash.com/photo-1523293915678-d1268a8e6400?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '19',
    name: 'Mini Ovo Brigadeiro',
    description: 'Casca Blend ou branca. Recheios: Brigadeiro, Ninho, Dois Amores, Brigadeiro com amendoim, Infantil (com miçangas coloridas). Pesando até 50g.',
    price: 7.00,
    category: 'Lembrancinhas & Mimos',
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&q=80&w=800',
    active: true
  },
  {
    id: '20',
    name: 'Ovo Bombom',
    description: 'Casca Blend ou branca. Recheios: Ninho, Brigadeiro ou 2 amores. Adicional: Morango ou Uva verde. Pesando até 120g.',
    price: 12.00,
    category: 'Lembrancinhas & Mimos',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    active: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PAQ-2026-0001',
    customerName: 'Mariana Silva',
    phone: '(83) 98888-7777',
    deliveryType: 'Entrega',
    address: {
      street: 'Av. Principal',
      number: '1000',
      neighborhood: 'Bairro Nobre',
      complement: 'Apto 42'
    },
    preferredDate: '2026-04-03',
    preferredTime: 'manhã',
    items: [
      { ...INITIAL_PRODUCTS[0], quantity: 2 }
    ],
    subtotal: 150.00,
    deliveryFee: 5.00,
    total: 155.00,
    status: 'Novo',
    reservationPaid: false,
    totalPaid: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'PAQ-2026-0002',
    customerName: 'Ricardo Oliveira',
    phone: '(83) 97777-6666',
    deliveryType: 'Retirada',
    preferredDate: '2026-04-04',
    preferredTime: 'tarde',
    items: [
      { ...INITIAL_PRODUCTS[6], quantity: 1 },
      { ...INITIAL_PRODUCTS[14], quantity: 1 }
    ],
    subtotal: 110.00,
    deliveryFee: 0,
    total: 110.00,
    status: 'Em Produção',
    reservationPaid: true,
    totalPaid: false,
    createdAt: new Date().toISOString()
  }
];
