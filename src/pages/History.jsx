import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CalendarDays, FileText } from 'lucide-react';

const History = () => {
  const { orders, reservations } = useApp();
  const { user } = useAuth();

  const myOrders = orders.filter(o => o.userId === user?.id || o.cliente === user?.nombre);
  const myReservations = reservations.filter(r => r.nombre === user?.nombre);

  const statusBadge = (estado) => {
    const map = { Pendiente: 'bg-yellow-100 text-yellow-700', Preparando: 'bg-blue-100 text-blue-700', 'En camino': 'bg-indigo-100 text-indigo-700', Entregado: 'bg-green-100 text-green-700', Cancelado: 'bg-red-100 text-red-700' };
    return map[estado] || 'bg-gray-100 text-gray-700';
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-extrabold text-3xl text-dark mb-8">Mi Historial</h1>
        <div className="space-y-10">
          <div>
            <h2 className="font-display font-bold text-2xl text-dark mb-5 flex items-center gap-2"><ShoppingBag className="h-6 w-6 text-primary" /> Pedidos</h2>
            {myOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
                <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aun no tienes pedidos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-premium transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-dark">Pedido #{order.id}</p>
                        <p className="text-xs text-gray-500">{new Date(order.fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <span className={'text-xs font-bold px-3 py-1 rounded-full ' + statusBadge(order.estado)}>{order.estado}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.nombre} x{item.cantidad}</span>
                          <span className="font-medium">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">{order.metodoPago}</span>
                      <span className="font-bold text-primary text-lg">S/ {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-dark mb-5 flex items-center gap-2"><CalendarDays className="h-6 w-6 text-primary-orange" /> Reservas</h2>
            {myReservations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
                <CalendarDays className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aun no tienes reservas</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {myReservations.map((res) => (
                  <div key={res.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-premium transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-dark">{res.fecha} - {res.hora}</p>
                        <p className="text-xs text-gray-500">{res.personas} persona(s)</p>
                      </div>
                      <span className={'text-xs font-bold px-3 py-1 rounded-full ' + (res.estado === 'confirmada' ? 'bg-green-100 text-green-700' : res.estado === 'cancelada' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}>{res.estado}</span>
                    </div>
                    {res.comentarios && <p className="text-xs text-gray-400">{res.comentarios}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default History;
