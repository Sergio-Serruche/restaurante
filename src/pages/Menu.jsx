import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { Search, Star, ShoppingCart, ArrowUpDown, Flame, Utensils } from 'lucide-react';

const Menu = () => {
  const { products } = useApp();
  const { addToCart } = useCart();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default'); // default, priceAsc, priceDesc, popularity

  const categories = useMemo(() => {
    return ['Todos', '🍛 Platos', '🥗 Entradas', '🍹 Bebidas Frías', '☕ Bebidas Calientes', '🍰 Postres'];
  }, []);

  // Filter & Sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.descripcion.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (selectedCategory !== 'Todos') {
      result = result.filter(p => p.categoria === selectedCategory);
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => b.popularidad - a.popularidad);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.calificacion - a.calificacion);
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-light font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="font-display font-extrabold text-4xl text-dark mb-3">
            Nuestra Carta Deliciosa
          </h1>
          <p className="text-gray-500">
            Explora una variedad de platos elaborados con ingredientes seleccionados y el toque tradicional de nuestra cocina.
          </p>
        </div>

        {/* Search, Category Filter, and Sort Controls */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-premium mb-10 flex flex-col gap-6">
          
          {/* Row 1: Search & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-8">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar tu plato o bebida favorita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-light rounded-2xl border-0 focus:ring-2 focus:ring-primary text-sm text-dark placeholder-gray-400 transition-all duration-200 outline-none"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative md:col-span-4">
              <div className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none flex items-center">
                <ArrowUpDown className="h-5 w-5" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-light rounded-2xl border-0 focus:ring-2 focus:ring-primary text-sm text-dark appearance-none outline-none cursor-pointer"
              >
                <option value="default">Ordenar por (Defecto)</option>
                <option value="priceAsc">Precio: Menor a Mayor</option>
                <option value="priceDesc">Precio: Mayor a Menor</option>
                <option value="popularity">Más Vendidos (Popularidad)</option>
                <option value="rating">Mejor Calificados</option>
              </select>
              <div className="absolute right-4 top-4.5 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-dark"></div>
            </div>
          </div>

          {/* Row 2: Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-premium'
                    : 'bg-light text-gray-600 hover:bg-gray-200/70 hover:text-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={product.id}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-premium group flex flex-col transition-all duration-300"
                >
                  {/* Image Container with zoom and tag */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img 
                      src={product.imagen || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"} 
                      alt={product.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Category Label */}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-dark shadow-sm">
                      {product.categoria}
                    </span>

                    {/* Popularity Flame tag */}
                    {product.popularidad > 90 && (
                      <span className="absolute top-4 right-4 bg-primary-orange text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-sm flex items-center gap-1 uppercase tracking-wider">
                        <Flame className="h-3 w-3 fill-white" /> Popular
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Rating & Name */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 bg-gold/10 px-2 py-0.5 rounded-lg text-gold text-xs font-bold">
                          <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {product.calificacion.toFixed(1)}
                        </div>
                        <span className="text-xs text-gray-400">({product.ventas} vendidos)</span>
                      </div>
                      
                      <h3 className="font-display font-bold text-lg text-dark group-hover:text-primary transition-colors mb-2 line-clamp-1">
                        {product.nombre}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                        {product.descripcion}
                      </p>
                    </div>

                    {/* Price and Cart Button */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-400 block font-medium">Precio</span>
                        <span className="font-display font-extrabold text-xl text-dark">S/ {product.precio.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={() => addToCart(product)}
                        className="p-3 bg-primary-orange hover:bg-primary-orange/95 text-white rounded-2xl shadow-orange-premium hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                        title="Agregar al carrito"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-dark mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Intenta cambiar los términos de búsqueda o selecciona otra categoría.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;
