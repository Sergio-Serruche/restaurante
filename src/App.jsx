import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Reservations from './pages/Reservations';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppProvider>
            <div className="flex flex-col min-h-screen bg-light font-body">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/carrito" element={<Cart />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/reservas" element={<Reservations />} />
                  <Route path="/historial" element={<ProtectedRoute><History /></ProtectedRoute>} />
                  <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/registro" element={<Register />} />
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={['administrador']}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </AppProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
