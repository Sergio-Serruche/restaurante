import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);

  // Initialize data on mount
  useEffect(() => {
    // 1. Products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }

    // 2. Users (AuthContext handles the creation of default admin and client, but we read them here too)
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    // 3. Reservations
    const savedReservations = localStorage.getItem('reservations');
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    } else {
      // Seed mock reservations for charts
      const mockReservations = [
        { id: 'res-1', nombre: 'Carlos Mendoza', fecha: '2026-07-10', hora: '19:30', personas: 4, comentarios: 'Mesa cerca de la ventana', estado: 'confirmada' },
        { id: 'res-2', nombre: 'Ana Gómez', fecha: '2026-07-12', hora: '20:00', personas: 2, comentarios: 'Celebración de aniversario', estado: 'confirmada' },
        { id: 'res-3', nombre: 'José Quispe', fecha: '2026-07-15', hora: '13:00', personas: 6, comentarios: 'Almuerzo familiar', estado: 'confirmada' },
        { id: 'res-4', nombre: 'María Luján', fecha: '2026-07-19', hora: '21:00', personas: 3, comentarios: 'Ninguno', estado: 'pendiente' },
        { id: 'res-5', nombre: 'Lucía Torres', fecha: '2026-08-05', hora: '19:00', personas: 4, comentarios: 'Mesa tranquila', estado: 'pendiente' },
        { id: 'res-6', nombre: 'Roberto Soto', fecha: '2026-06-18', hora: '20:30', personas: 5, comentarios: 'Cumpleaños', estado: 'confirmada' },
        { id: 'res-7', nombre: 'Julia Ramos', fecha: '2026-06-25', hora: '14:00', personas: 2, comentarios: 'Reunión de negocios', estado: 'cancelada' }
      ];
      localStorage.setItem('reservations', JSON.stringify(mockReservations));
      setReservations(mockReservations);
    }

    // 4. Orders (Pedidos)
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Seed mock orders for charts and history
      const mockOrders = [
        {
          id: 'PED-1001',
          userId: 'client-1',
          cliente: 'Cliente de Prueba',
          fecha: '2026-07-15T12:30:00.000Z',
          direccion: 'Av. Larco 456',
          distrito: 'Miraflores',
          telefono: '987654321',
          metodoPago: 'Yape',
          items: [
            { id: '1', nombre: "Lomo Saltado Adriano's", precio: 45.00, cantidad: 2 },
            { id: '8', nombre: 'Chicha Morada de la Casa (1L)', precio: 15.00, cantidad: 1 }
          ],
          subtotal: 105.00,
          igv: 18.90,
          total: 123.90,
          estado: 'Entregado'
        },
        {
          id: 'PED-1002',
          userId: 'client-2',
          cliente: 'Juan Perez',
          fecha: '2026-07-16T19:45:00.000Z',
          direccion: 'Calle Los Pinos 789',
          distrito: 'San Isidro',
          telefono: '999111222',
          metodoPago: 'Tarjeta',
          items: [
            { id: '3', nombre: "Hamburguesa Premium Adriano's", precio: 29.90, cantidad: 1 },
            { id: '13', nombre: 'Torta de Chocolate Húmeda', precio: 14.50, cantidad: 1 },
            { id: '10', nombre: 'Maracuyá Frozen', precio: 13.00, cantidad: 2 }
          ],
          subtotal: 70.40,
          igv: 12.67,
          total: 83.07,
          estado: 'Entregado'
        },
        {
          id: 'PED-1003',
          userId: 'client-3',
          cliente: 'Sofía Castro',
          fecha: '2026-07-18T14:15:00.000Z',
          direccion: 'Av. Arequipa 3420',
          distrito: 'Lince',
          telefono: '981273912',
          metodoPago: 'Efectivo',
          items: [
            { id: '2', nombre: 'Ceviche Carretillero', precio: 38.00, cantidad: 1 },
            { id: '6', nombre: 'Tequeños Rellenos de Queso', precio: 16.00, cantidad: 1 }
          ],
          subtotal: 54.00,
          igv: 9.72,
          total: 63.72,
          estado: 'Preparando'
        },
        {
          id: 'PED-1004',
          userId: 'client-1',
          cliente: 'Cliente de Prueba',
          fecha: '2026-07-19T11:00:00.000Z',
          direccion: 'Av. Larco 456',
          distrito: 'Miraflores',
          telefono: '987654321',
          metodoPago: 'Yape',
          items: [
            { id: '4', nombre: 'Fettuccine a la Huancaína con Lomo', precio: 42.00, cantidad: 1 },
            { id: '11', nombre: 'Café Capuccino Orgánico', precio: 9.50, cantidad: 1 }
          ],
          subtotal: 51.50,
          igv: 9.27,
          total: 60.77,
          estado: 'Pendiente'
        }
      ];
      localStorage.setItem('orders', JSON.stringify(mockOrders));
      setOrders(mockOrders);
    }
  }, []);

  // Listen to users changes in LocalStorage (in case AuthContext updates users)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) setUsers(JSON.parse(savedUsers));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const refreshUsers = () => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));
  };

  // CRUD Products
  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      precio: parseFloat(productData.precio) || 0,
      calificacion: parseFloat(productData.calificacion) || 5.0,
      ventas: 0,
      popularidad: 0
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    return { success: true, product: newProduct };
  };

  const editProduct = (id, updatedData) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updatedData,
          precio: parseFloat(updatedData.precio) || p.precio,
          calificacion: parseFloat(updatedData.calificacion) || p.calificacion
        };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    return { success: true };
  };

  const deleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    return { success: true };
  };

  // CRUD Users (Admin actions)
  const editUserRole = (id, newRol) => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = savedUsers.map(u => {
      if (u.id === id) {
        return { ...u, rol: newRol };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updated));
    setUsers(updated);
    
    // If we changed the role of the currently logged-in user, we should sync activeUser
    const activeUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
    if (activeUser.id === id) {
      const updatedActive = { ...activeUser, rol: newRol };
      localStorage.setItem('activeUser', JSON.stringify(updatedActive));
      // Refresh window session
      window.location.reload();
    }
    return { success: true };
  };

  const editUserAdmin = (id, userData) => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = savedUsers.map(u => {
      if (u.id === id) {
        return { ...u, ...userData };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updated));
    setUsers(updated);
    return { success: true };
  };

  const deleteUser = (id) => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updated = savedUsers.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(updated));
    setUsers(updated);
    return { success: true };
  };

  // CRUD Reservations
  const addReservation = (reservationData) => {
    const newRes = {
      id: `res-${Date.now()}`,
      ...reservationData,
      estado: 'pendiente'
    };
    const updated = [newRes, ...reservations];
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
    return { success: true, reservation: newRes };
  };

  const updateReservationStatus = (id, newStatus) => {
    const updated = reservations.map(r => {
      if (r.id === id) return { ...r, estado: newStatus };
      return r;
    });
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
    return { success: true };
  };

  const deleteReservation = (id) => {
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
    return { success: true };
  };

  // CRUD Pedidos
  const addOrder = (orderData) => {
    const newOrder = {
      id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: new Date().toISOString(),
      estado: 'Pendiente',
      ...orderData
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    return { success: true, order: newOrder };
  };

  const updateOrderStatus = (id, newStatus) => {
    const updated = orders.map(o => {
      if (o.id === id) return { ...o, estado: newStatus };
      return o;
    });
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));
    return { success: true };
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      reservations,
      users,
      refreshUsers,
      addProduct,
      editProduct,
      deleteProduct,
      editUserRole,
      editUserAdmin,
      deleteUser,
      addReservation,
      updateReservationStatus,
      deleteReservation,
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
