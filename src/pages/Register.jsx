import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', telefono: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const CryptoJS = require('crypto-js');
    const hash = CryptoJS.SHA256(form.password).toString();
    if (users.some(u => u.email === form.email)) {
      setError('El correo ya est\u00e1 registrado');
      setLoading(false);
      return;
    }
    const newUser = {
      id: 'user-' + Date.now(),
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono || '',
      foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rol: 'cliente',
      passwordHash: hash
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('activeUser', JSON.stringify({
      id: newUser.id, nombre: newUser.nombre, email: newUser.email,
      telefono: newUser.telefono, foto: newUser.foto, rol: newUser.rol
    }));
    navigate('/');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary p-3 rounded-2xl text-white inline-flex mb-4">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-dark">Crear Cuenta</h1>
          <p className="text-gray-500 mt-2">Registrate en Delicias</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-premium">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Nombre</label>
              <input type="text" name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Tu nombre completo" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Correo</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Telefono</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+51 999 888 777" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Contrasena</label>
              <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" className="w-full px-4 py-3 bg-light rounded-xl border-0 text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-premium transition-all duration-200">
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-500">
            Ya tienes cuenta? <Link to="/login" className="text-primary font-bold hover:underline">Inicia sesion</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
