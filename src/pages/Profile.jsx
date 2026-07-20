import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [foto, setFoto] = useState(user?.foto || '');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setFoto(reader.result); reader.readAsDataURL(file); }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = { nombre: nombre || user.nombre, email: email || user.email, telefono: telefono || user.telefono, foto: foto || user.foto };
    if (newPassword.trim()) data.newPassword = newPassword;
    updateProfile(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <h1 className="font-display font-extrabold text-3xl text-dark">Mi Perfil</h1>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-premium overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-orange p-8 text-center">
            <div className="relative inline-block">
              <img src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} alt="" className="w-24 h-24 rounded-full border-4 border-white/60 object-cover" />
              <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <Camera className="h-4 w-4 text-primary" />
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <h2 className="text-white font-display font-bold text-xl mt-3">{user.nombre}</h2>
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mt-1 capitalize">{user.rol}</span>
          </div>
          <form onSubmit={handleUpdate} className="p-8 space-y-5">
            {saved && <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm font-semibold">Perfil actualizado correctamente</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Nombre</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Correo</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Teléfono</label>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Nueva Contraseña (opcional)</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Dejar vacío para mantener" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-premium transition-all duration-200">
              <Save className="h-4 w-4" /> Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
