import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  Search,
  Filter,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Truck,
  Store,
  X,
  DollarSign,
  Check
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { OrderStatus, Order } from '../types';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { handleFirestoreError, OperationType } from '../utils/firestore';

export const AdminOrdersView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleToggleReservationPaid = async (order: Order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), { reservationPaid: !order.reservationPaid });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${order.id}`);
    }
  };

  const handleToggleTotalPaid = async (order: Order) => {
    try {
      await updateDoc(doc(db, 'orders', order.id), { totalPaid: !order.totalPaid });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${order.id}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'SET_VIEW', payload: 'home' });
    } catch (err) {
      console.error("Logout Error: ", err);
    }
  };

  const filteredOrders = state.orders.filter(order => {
    const matchesStatus = filterStatus === 'Todos' || order.status === filterStatus;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = state.orders.reduce((acc, o) => acc + o.total, 0);
  const totalReservedPaid = state.orders.filter(o => o.reservationPaid).reduce((acc, o) => acc + (o.total / 2), 0);
  const totalBalancePaid = state.orders.filter(o => o.totalPaid).reduce((acc, o) => acc + (o.total / 2), 0);
  const totalCollected = totalReservedPaid + totalBalancePaid;

  const kpis = [
    { label: 'Total de Pedidos', value: state.orders.length, icon: <ShoppingBag />, color: 'text-gold' },
    { label: 'Total em Vendas', value: totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: <TrendingUp />, color: 'text-green-400' },
    { label: 'Total Recebido', value: totalCollected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: <DollarSign />, color: 'text-emerald-400' },
    { label: 'Pendentes', value: state.orders.filter(o => o.status === 'Novo').length, icon: <AlertCircle />, color: 'text-blue-400' },
  ];

  const statusColors: Record<OrderStatus, string> = {
    'Novo': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Em Produção': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Pronto': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Entregue': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };

  const nextStatus: Record<OrderStatus, OrderStatus> = {
    'Novo': 'Em Produção',
    'Em Produção': 'Pronto',
    'Pronto': 'Entregue',
    'Entregue': 'Entregue'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-gold">Painel de Pedidos</h1>
          <p className="text-beige-satin/60">Gestão de encomendas de Páscoa 2026</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin-products' })}
            className="px-6 py-2 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition-all flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Produtos
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="kraft-texture p-6 rounded-2xl border border-gold/10 flex items-center gap-4"
          >
            <div className={`p-3 bg-chocolate-bitter/40 rounded-xl ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-beige-satin/40 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-serif text-beige-satin">{kpi.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-chocolate-bitter/20 p-6 rounded-2xl border border-gold/10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/40" />
          <input
            type="text"
            placeholder="Buscar por cliente ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-chocolate-dark border border-gold/20 rounded-xl p-3 pl-11 focus:border-gold outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {['Todos', 'Novo', 'Em Produção', 'Pronto', 'Entregue'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === status
                  ? 'bg-gold text-chocolate-dark'
                  : 'bg-chocolate-dark text-beige-satin/60 border border-gold/10 hover:border-gold/30'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List (Table on Desktop, Cards on Mobile) */}
      <div className="bg-chocolate-bitter/20 rounded-2xl border border-gold/10 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gold/5 border-b border-gold/10">
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Pedido</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Cliente</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold text-center">Reserva (50%)</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold text-center">Saldo (50%)</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Total</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Entrega</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold">Status</th>
                <th className="p-6 text-xs uppercase tracking-widest text-gold font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gold/5 transition-colors group">
                  <td className="p-6">
                    <span className="text-sm font-mono text-gold">{order.id}</span>
                    <p className="text-[10px] text-beige-satin/40 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-medium text-beige-satin">{order.customerName}</p>
                    <p className="text-xs text-beige-satin/40">{order.phone}</p>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => handleToggleReservationPaid(order)}
                      className={`flex flex-col items-center gap-1 mx-auto transition-all ${order.reservationPaid ? 'text-green-400' : 'text-beige-satin/30 hover:text-gold'}`}
                    >
                      <span className="text-sm font-medium">
                        {(order.total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${order.reservationPaid ? 'bg-green-500/20 border-green-500' : 'border-gold/20'}`}>
                        {order.reservationPaid && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => handleToggleTotalPaid(order)}
                      className={`flex flex-col items-center gap-1 mx-auto transition-all ${order.totalPaid ? 'text-green-400' : 'text-beige-satin/30 hover:text-gold'}`}
                    >
                      <span className="text-sm font-medium">
                        {(order.total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${order.totalPaid ? 'bg-green-500/20 border-green-500' : 'border-gold/20'}`}>
                        {order.totalPaid && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  </td>
                  <td className="p-6">
                    <span className="text-sm font-serif text-beige-satin">
                      {order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      {order.deliveryType === 'Entrega' ? <Truck className="w-4 h-4 text-gold/60" /> : <Store className="w-4 h-4 text-gold/60" />}
                      <span className="text-xs text-beige-satin/70">{order.deliveryType}</span>
                    </div>
                    <p className="text-[10px] text-beige-satin/40 mt-1">{order.preferredDate}</p>
                  </td>
                  <td className="p-6">
                    <button
                      onClick={() => handleUpdateStatus(order.id, nextStatus[order.status])}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </button>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-chocolate-dark transition-all"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a
                        href={`https://wa.me/55${order.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-gold/10">
          {filteredOrders.map(order => (
            <div key={order.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-mono text-gold">{order.id}</span>
                  <p className="text-lg font-serif text-beige-satin">{order.customerName}</p>
                  <p className="text-xs text-beige-satin/40">{order.phone}</p>
                </div>
                <button
                  onClick={() => handleUpdateStatus(order.id, nextStatus[order.status])}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${statusColors[order.status]}`}
                >
                  {order.status}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gold/5">
                <button
                  onClick={() => handleToggleReservationPaid(order)}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all ${order.reservationPaid ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-chocolate-dark border-gold/10 text-beige-satin/40'}`}
                >
                  <span className="text-[10px] uppercase tracking-widest mb-1">Reserva</span>
                  <span className="text-sm font-bold">{(order.total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <div className={`mt-2 w-5 h-5 rounded-full border flex items-center justify-center ${order.reservationPaid ? 'bg-green-500 text-chocolate-dark' : 'border-gold/20'}`}>
                    {order.reservationPaid && <Check className="w-3 h-3" />}
                  </div>
                </button>
                <button
                  onClick={() => handleToggleTotalPaid(order)}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all ${order.totalPaid ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-chocolate-dark border-gold/10 text-beige-satin/40'}`}
                >
                  <span className="text-[10px] uppercase tracking-widest mb-1">Saldo</span>
                  <span className="text-sm font-bold">{(order.total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <div className={`mt-2 w-5 h-5 rounded-full border flex items-center justify-center ${order.totalPaid ? 'bg-green-500 text-chocolate-dark' : 'border-gold/20'}`}>
                    {order.totalPaid && <Check className="w-3 h-3" />}
                  </div>
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {order.deliveryType === 'Entrega' ? <Truck className="w-4 h-4 text-gold/60" /> : <Store className="w-4 h-4 text-gold/60" />}
                    <span className="text-xs text-beige-satin/70">{order.deliveryType}</span>
                  </div>
                  <p className="text-[10px] text-beige-satin/40">{order.preferredDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-beige-satin/40">Total</p>
                  <p className="text-xl font-serif text-gold">{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 py-3 bg-gold/10 text-gold rounded-xl hover:bg-gold hover:text-chocolate-dark transition-all flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <Eye className="w-4 h-4" /> Detalhes
                </button>
                <a
                  href={`https://wa.me/55${order.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-bold"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center opacity-40">
            <p className="font-serif italic">Nenhum pedido encontrado.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-chocolate-dark border border-gold/20 rounded-3xl z-50 overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-chocolate-bitter/30">
                <h2 className="text-2xl font-serif text-gold">Detalhes do Pedido {selectedOrder.id}</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gold/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Informações do Cliente</h3>
                    <div className="space-y-1">
                      <p className="text-beige-satin font-medium">{selectedOrder.customerName}</p>
                      <p className="text-sm text-beige-satin/60">{selectedOrder.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Entrega / Retirada</h3>
                    <div className="space-y-1">
                      <p className="text-beige-satin font-medium">{selectedOrder.deliveryType}</p>
                      <p className="text-sm text-beige-satin/60">{selectedOrder.preferredDate} - {selectedOrder.preferredTime}</p>
                      {selectedOrder.address && (
                        <p className="text-xs text-beige-satin/40 leading-tight">
                          {selectedOrder.address.street}, {selectedOrder.address.number} - {selectedOrder.address.neighborhood}
                          {selectedOrder.address.complement && ` (${selectedOrder.address.complement})`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Itens do Pedido</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm bg-chocolate-bitter/20 p-3 rounded-xl border border-gold/5">
                        <div className="flex items-center gap-3">
                          <span className="text-gold font-bold">{item.quantity}x</span>
                          <span className="text-beige-satin/80">{item.name}</span>
                        </div>
                        <span className="text-beige-satin">
                          {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Pagamentos</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-beige-satin/60">Reserva (50%)</span>
                        <span className={selectedOrder.reservationPaid ? 'text-green-400' : 'text-red-400'}>
                          {selectedOrder.reservationPaid ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-beige-satin/60">Saldo (50%)</span>
                        <span className={selectedOrder.totalPaid ? 'text-green-400' : 'text-red-400'}>
                          {selectedOrder.totalPaid ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedOrder.observations && (
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase tracking-widest text-gold font-bold">Observações</h3>
                      <p className="text-sm text-beige-satin/60 italic bg-gold/5 p-4 rounded-xl border border-gold/10">
                        "{selectedOrder.observations}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gold/10 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-beige-satin/40 mb-1">Status Atual</p>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold border ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-beige-satin/40 mb-1">Total do Pedido</p>
                    <p className="text-3xl font-serif text-gold">
                      {selectedOrder.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
