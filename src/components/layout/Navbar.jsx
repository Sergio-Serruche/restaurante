import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  History, 
  LayoutDashboard,
  ChefHat
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Menú', path: '/menu' },
    { name: 'Reservas', path: '/reservas' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass shadow-md py-3' 
        : 'bg-white/95 md:bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary p-2.5 rounded-2xl text-white shadow-premium group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <span className="font-elegant font-bold text-2xl tracking-tight text-dark">
                Adriano's<span className="text-primary">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors text-sm lg:text-base ${
                  isActive(link.path) 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-dark/80 hover:text-primary pb-1'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action buttons / User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link 
              to="/carrito" 
              className="relative p-2.5 rounded-full hover:bg-light transition-colors text-dark/80 hover:text-primary-orange"
            >
              <ShoppingCart className="h-6 w-6" />
              {getItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {getItemsCount()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4 pl-2 border-l border-gray-200">
                {/* User avatar and dropdown info */}
                <div className="flex items-center gap-3">
                  <Link to="/perfil" className="flex items-center gap-2.5 group">
                    <img 
                      src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                      alt={user.nombre}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-dark group-hover:text-primary transition-colors max-w-[120px] truncate">
                        {user.nombre}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {user.rol}
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Dashboard Shortcut */}
                {(user.rol === 'administrador' || user.rol === 'cocinero' || user.rol === 'repartidor') && (
                  <Link 
                    to="/admin" 
                    className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl transition-all duration-200"
                    title="Panel de Administración"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}

                {user.rol === 'cliente' && (
                  <Link 
                    to="/historial" 
                    className="p-2 bg-primary-orange/10 hover:bg-primary-orange text-primary-orange hover:text-white rounded-xl transition-all duration-200"
                    title="Historial de Pedidos"
                  >
                    <History className="h-5 w-5" />
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-200"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-sm font-semibold text-dark hover:text-primary transition-colors"
                >
                  Ingresar
                </Link>
                <Link 
                  to="/registro" 
                  className="px-5 py-2.5 text-sm font-semibold bg-primary-orange hover:bg-primary-orange/95 text-white rounded-xl shadow-orange-premium hover:-translate-y-0.5 transition-all duration-200"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link 
              to="/carrito" 
              className="relative p-2 text-dark/80"
            >
              <ShoppingCart className="h-6 w-6" />
              {getItemsCount() > 0 && (
                <span className="absolute top-0 right-0 bg-primary-orange text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {getItemsCount()}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-dark hover:bg-light transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden glass animate-fade-in border-b border-gray-200 absolute top-full left-0 w-full px-4 pt-2 pb-6 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium text-base transition-colors ${
                isActive(link.path) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-dark hover:bg-light'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-3 px-4 py-2">
                <img 
                  src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={user.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-dark">{user.nombre}</span>
                  <span className="text-xs text-gray-500 capitalize">{user.rol}</span>
                </div>
              </div>

              <Link
                to="/perfil"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-light font-medium text-dark"
              >
                <UserIcon className="h-5 w-5 text-gray-400" /> Mi Perfil
              </Link>

              {(user.rol === 'administrador' || user.rol === 'cocinero' || user.rol === 'repartidor') && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-light font-medium text-primary"
                >
                  <LayoutDashboard className="h-5 w-5" /> Panel Administrador
                </Link>
              )}

              {user.rol === 'cliente' && (
                <Link
                  to="/historial"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-light font-medium text-primary-orange"
                >
                  <History className="h-5 w-5" /> Historial de Pedidos
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-primary hover:bg-primary/5 font-medium text-left"
              >
                <LogOut className="h-5 w-5" /> Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-xl font-semibold text-dark hover:bg-light transition-colors"
              >
                Ingresar
              </Link>
              <Link 
                to="/registro" 
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-xl font-semibold bg-primary-orange hover:bg-primary-orange/95 text-white shadow-md transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
