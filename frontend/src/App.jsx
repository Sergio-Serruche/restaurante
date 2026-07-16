import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito guardado en localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleAddToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id);
    let updated;
    if (existing) {
      updated = cartItems.map(item =>
        item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      updated = [...cartItems, { ...product, cantidad: 1 }];
    }
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemoveFromCart = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar cartCount={getCartCount()} />
        
        <main style={{ flexGrow: 1, backgroundColor: '#FAFAF9' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/menu" element={<Menu onAddToCart={handleAddToCart} />} />
            <Route 
              path="/carrito" 
              element={
                <Cart 
                  cartItems={cartItems} 
                  onRemoveFromCart={handleRemoveFromCart} 
                  onClearCart={handleClearCart} 
                />
              } 
            />
            
            {/* Rutas Protegidas para Cliente */}
            <Route 
              path="/mis-pedidos" 
              element={
                <ProtectedRoute allowedRoles={['cliente']}>
                  <MyOrders />
                </ProtectedRoute>
              } 
            />

            {/* Rutas Protegidas para Administrador / Cocinero */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'cocinero']}>
                  <Admin />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
