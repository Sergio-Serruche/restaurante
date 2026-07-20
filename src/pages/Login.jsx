import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '';
  const [cuemail, setCuemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = login(cuemail, password);
    if (result.success) {
      if (result.user.rol === 'administrador' || result.user.rol === 'cocinero') {
        navigate('/admin');
      } else if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-primary p-3 rounded-2xl text-white inline-flex mb-4">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-dark">Iniciar Sesión</h1>
          <p className="text-gray-500 mt-2">Accede a tu cuenta Delicias</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-premium">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Correo</label>
              <input type="email" required placeholder="correo@ejemplo.com" value={cuemail} onChange={(e) => setCuemail(e.target.value)} className="w-full px-4 py-3 bg-light rounded-xl border-0 text-dark text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-gray-600">Contraseña</label>
              <input type="password" required placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-light rounded-xl border-0 text-dark text-sm focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl shadow-premium transition-all duration-200">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-500">
            ¿No tienes cuenta? <Link to="/registro" className="text-primary font-bold hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
