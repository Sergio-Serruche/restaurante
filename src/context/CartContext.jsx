import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart items:", e);
      }
    }
  }, []);

  // Save cart items to LocalStorage on changes
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updated;
    if (existingItem) {
      updated = cartItems.map(item =>
        item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
    } else {
      updated = [...cartItems, { ...product, cantidad: 1 }];
    }
    saveCart(updated);
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map(item =>
      item.id === productId ? { ...item, cantidad: newQuantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Calculations
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  // In Peru, IGV is 18%. 
  // Normally prices in Peru include IGV. But let's show the breakdown:
  // Subtotal (Base Imponible) + IGV (18%) = Total
  // Or we can calculate IGV as 18% of the subtotal. Let's make:
  // Subtotal = Total / 1.18, IGV = Total - Subtotal
  // Or we can assume prices are net and add 18%. Let's calculate:
  // Subtotal = sum(price * qty)
  // IGV = Subtotal * 0.18
  // Total = Subtotal + IGV
  // Let's do this latter one since it matches "Mostrar Subtotal, Mostrar IGV, Mostrar Total". 
  // Let's make: 
  // Subtotal = sum of items
  // IGV = Subtotal * 0.18
  // Total = Subtotal + IGV
  const subtotal = getSubtotal();
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const getItemsCount = () => {
    return cartItems.reduce((acc, item) => acc + item.cantidad, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      igv,
      total,
      getItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
