import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '';
  const [cuemail, setCuemail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = login(cuemail, password);
    if (result.success) {
      if (result.user.rol === 'administrador' || result.user.rol === 'cocinero' || result.user.rol === 'repartidor') {
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
          <p className="text-gray-500 mt-2">Accede a tu cuenta Adriano's</p>
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
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 pr-12 bg-light rounded-xl border-0 text-dark text-sm focus:ring-2 focus:ring-primary outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
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
