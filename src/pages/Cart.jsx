import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    igv, 
    total 
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (!user) {
      // Redirect to login but store redirect parameter or tell them they need to login
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="font-display font-extrabold text-3xl text-dark mb-8 flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" /> Mi Carrito de Compras
        </h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Header actions */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-sm font-semibold text-gray-500">
                  {cartItems.length} {cartItems.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Vaciar Carrito
                </button>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-grow text-center sm:text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {item.categoria}
                      </span>
                      <h3 className="font-display font-bold text-base sm:text-lg text-dark line-clamp-1">
                        {item.nombre}
                      </h3>
                      <p className="font-display font-bold text-primary text-sm mt-1 sm:hidden">
                        S/ {item.precio.toFixed(2)} c/u
                      </p>
                    </div>

                    {/* Quantity Controls & Prices */}
                    <div className="flex flex-row sm:flex-row items-center justify-between w-full sm:w-auto gap-4 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      
                      {/* Price per unit (desktop only) */}
                      <div className="hidden sm:block text-right">
                        <span className="text-xs text-gray-400 block">Unitario</span>
                        <span className="font-semibold text-gray-700 text-sm">S/ {item.precio.toFixed(2)}</span>
                      </div>

                      {/* Counter */}
                      <div className="flex items-center bg-light rounded-xl p-1 border border-gray-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-all"
                        >
                          <Minus className="h-4.5 w-4.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-dark">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-white rounded-lg transition-all"
                        >
                          <Plus className="h-4.5 w-4.5" />
                        </button>
                      </div>

                      {/* Subtotal Item */}
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total</span>
                        <span className="font-display font-extrabold text-base text-dark">
                          S/ {(item.precio * item.cantidad).toFixed(2)}
                        </span>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar de carrito"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>

              {/* Keep shopping link */}
              <div className="pt-2">
                <Link 
                  to="/menu" 
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Seguir comprando en la carta
                </Link>
              </div>

            </div>

            {/* Right Column: Checkout Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-premium p-6 space-y-6">
                <h3 className="font-display font-bold text-lg text-dark border-b border-gray-100 pb-3">
                  Resumen de Compra
                </h3>

                {/* Subtotals detail */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-dark">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-500">
                    <span>IGV (18%)</span>
                    <span className="font-medium text-dark">S/ {igv.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-dark text-base">Total General</span>
                    <span className="font-display font-extrabold text-2xl text-primary">
                      S/ {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* User Info Alert if not logged in */}
                {!user && (
                  <div className="p-3 bg-orange-50 text-primary-orange text-xs rounded-xl font-medium">
                    ⚠️ Inicia sesión para completar tu pedido y acumular puntos estrella de fidelidad.
                  </div>
                )}

                {/* Submit Checkout Button */}
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-4 bg-primary-orange hover:bg-primary-orange/95 text-white font-bold rounded-2xl shadow-orange-premium flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Procesar Pedido <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Empty Cart State */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-dark mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm sm:text-base">
              Parece que aún no has agregado delicias a tu carrito. ¡Explora nuestra carta y encuentra algo riquísimo!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-premium hover:bg-primary/95 transition-all"
            >
              Ir a ver el menú
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
