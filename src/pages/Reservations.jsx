import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CalendarDays, Clock, Users, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const Reservations = () => {
  const { addReservation, reservations } = useApp();
  const { user } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(1);
  const [comentarios, setComentarios] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = user ? user.nombre : nombre;
    if (!displayName || !fecha || !hora) {
      setMessage('Completa todos los campos obligatorios.');
      return;
    }
    const result = addReservation({ nombre: displayName, fecha, hora, personas, comentarios });
    if (result.success) {
      setMessage('Reserva creada exitosamente!');
      setTimeout(() => setMessage(''), 3000);
      setFecha(''); setHora(''); setPersonas(1); setComentarios('');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="bg-primary p-3 rounded-2xl text-white inline-flex mb-4">
            <CalendarDays className="h-8 w-8" />
          </div>
          <h1 className="font-display font-extrabold text-4xl text-dark">Reserva tu Mesa</h1>
          <p className="text-gray-500 mt-2">Asegura tu lugar en Delicias para una experiencia inolvidable</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-premium p-8">
            {message && <div className="bg-green-50 text-green-700 p-3 rounded-xl mb-4 text-sm font-semibold">{message}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!user && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Nombre Completo</label>
                  <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Fecha</label>
                  <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Hora</label>
                  <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Numero de Personas</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPersonas(Math.max(1, personas - 1))} className="p-2 bg-light rounded-xl hover:bg-gray-200 transition-colors text-dark font-bold">-</button>
                  <span className="w-12 text-center font-bold text-lg">{personas}</span>
                  <button type="button" onClick={() => setPersonas(Math.min(20, personas + 1))} className="p-2 bg-light rounded-xl hover:bg-gray-200 transition-colors text-dark font-bold">+</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Comentarios (opcional)</label>
                <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} rows="3" placeholder="Alguna preferencia especial?" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none resize-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-premium transition-all duration-200">Confirmar Reserva</button>
            </form>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display font-bold text-xl text-dark mb-4">Tus Reservas Recientes</h3>
            {reservations.filter(r => r.nombre === user?.nombre).slice(0, 5).map((res) => (
              <div key={res.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-bold text-dark">{res.fecha} - {res.hora}</p>
                    <p className="text-xs text-gray-500">{res.personas} persona(s)</p>
                  </div>
                  <span className={'text-xs font-bold px-2.5 py-1 rounded-full ' + (res.estado === 'confirmada' ? 'bg-green-100 text-green-700' : res.estado === 'cancelada' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700')}>{res.estado}</span>
                </div>
                {res.comentarios && <p className="text-xs text-gray-400 mt-1">{res.comentarios}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reservations;
