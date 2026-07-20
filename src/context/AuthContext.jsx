import React, { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize default users if not exists
  useEffect(() => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      const defaultUsers = [
        {
          id: 'admin-1',
          nombre: 'Administrador Delicias',
          email: 'admin@delicias.com',
          telefono: '999888777',
          foto: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
          rol: 'administrador',
          passwordHash: hashPassword('Admin123*')
        },
        {
          id: 'client-1',
          nombre: 'Cliente de Prueba',
          email: 'cliente@delicias.com',
          telefono: '987654321',
          foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          rol: 'cliente',
          passwordHash: hashPassword('Cliente123*')
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    // Load active session
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const hashedPassword = hashPassword(password);
    const foundUser = users.find(u => u.email === email && u.passwordHash === hashedPassword);

    if (foundUser) {
      // Create user session object (omitting hashed password for security)
      const sessionUser = {
        id: foundUser.id,
        nombre: foundUser.nombre,
        email: foundUser.email,
        telefono: foundUser.telefono,
        foto: foundUser.foto,
        rol: foundUser.rol
      };
      localStorage.setItem('activeUser', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true, user: sessionUser };
    } else {
      return { success: false, message: 'Correo o contraseña incorrectos.' };
    }
  };

  const register = (nombre, email, telefono, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already registered
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'El correo electrónico ya se encuentra registrado.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      nombre,
      email,
      telefono: telefono || '',
      foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', // default photo
      rol: 'cliente', // new signups are clients by default
      passwordHash: hashPassword(password)
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Automatically log in the user
    const sessionUser = {
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      telefono: newUser.telefono,
      foto: newUser.foto,
      rol: newUser.rol
    };
    localStorage.setItem('activeUser', JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { success: true, user: sessionUser };
  };

  const logout = () => {
    localStorage.removeItem('activeUser');
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        const updated = { ...u, ...updatedData };
        if (updatedData.newPassword) {
          updated.passwordHash = hashPassword(updatedData.newPassword);
          delete updated.newPassword;
        }
        return updated;
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current session user
    const currentSessionUser = JSON.parse(localStorage.getItem('activeUser') || '{}');
    const newSessionUser = {
      ...currentSessionUser,
      nombre: updatedData.nombre || currentSessionUser.nombre,
      email: updatedData.email || currentSessionUser.email,
      telefono: updatedData.telefono || currentSessionUser.telefono,
      foto: updatedData.foto || currentSessionUser.foto
    };
    localStorage.setItem('activeUser', JSON.stringify(newSessionUser));
    setUser(newSessionUser);

    return { success: true, user: newSessionUser };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
