import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ShieldCheck, Zap, Award, Star, ArrowRight } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="pt-20 overflow-x-hidden font-body bg-light">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-16 lg:py-24 bg-gradient-to-br from-white via-red-50/20 to-orange-50/20">
        {/* Floating background decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <motion.span 
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs lg:text-sm font-bold tracking-wider uppercase mb-6"
              >
                <Star className="h-4 w-4 fill-primary text-primary" /> El Sabor de la Excelencia Digital
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-dark leading-tight mb-6"
              >
                Disfruta de la comida que amas, <span className="text-primary bg-gradient-to-r from-primary to-primary-orange bg-clip-text text-transparent">sin esperas.</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg text-gray-600 max-w-xl mb-8 leading-relaxed"
              >
                Pide en línea desde tu mesa, ordénalo para llevar o recíbelo en la puerta de tu casa con la rapidez y elegancia que te mereces.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-2xl shadow-premium hover:bg-primary/95 hover:-translate-y-1 transition-all duration-200"
                >
                  Ordenar Ahora <ArrowRight className="h-5 w-5" />
                </Link>
                
                <Link
                  to="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-dark border border-gray-200 font-semibold rounded-2xl hover:bg-light hover:-translate-y-1 transition-all duration-200"
                >
                  Ver Menú 🍛
                </Link>
              </motion.div>
              
              {/* Trust Badge */}
              <motion.div 
                variants={itemVariants}
                className="flex items-center gap-6 mt-12 pt-8 border-t border-gray-200/80 w-full justify-center lg:justify-start"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i} 
                      className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                      src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=100&auto=format&fit=crop&q=80`} 
                      alt="User avatar" 
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong className="text-dark font-semibold">+10,000</strong> clientes satisfechos en Lima
                  </p>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Graphic */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
              className="relative flex justify-center items-center"
            >
              {/* Circular light background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/20 to-primary/20 rounded-full filter blur-3xl -z-10"></div>
              
              <div className="relative w-80 h-80 sm:w-[450px] sm:h-[450px] rounded-full p-2 bg-gradient-to-tr from-primary via-primary-orange to-gold shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80" 
                  alt="Plato Gourmet" 
                  className="w-full h-full object-cover rounded-full rotate-2 hover:rotate-12 transition-transform duration-1000"
                />
              </div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3"
              >
                <div className="p-2 bg-primary-orange/10 rounded-xl text-primary-orange">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Entrega Rápida</p>
                  <p className="text-sm font-bold text-dark">Bajo 30 minutos</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-12 -right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3"
              >
                <div className="p-2 bg-gold/10 rounded-xl text-gold">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Chef Calificado</p>
                  <p className="text-sm font-bold text-dark">Sabor 5 Estrellas</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-dark mb-4">
              ¿Por qué elegir Delicias?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              Fusionamos la alta cocina con la mejor tecnología de pedidos para brindarte un servicio inigualable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 bg-light rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-premium transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <UtensilsCrossed className="h-8 w-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-dark mb-3">Menú Digital Premium</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Explora toda nuestra carta en línea. Filtra por categorías de manera instantánea y personaliza tus platos favoritos.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 bg-light rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-orange-premium transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary-orange/10 text-primary-orange rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-dark mb-3">Pedidos Seguros</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Paga de forma rápida y confiable usando Yape (con código QR interactivo), tarjetas de crédito o efectivo en la entrega.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -8 }}
              className="p-8 bg-light rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm hover:shadow-premium transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gold/10 text-gold rounded-2xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-dark mb-3">Reservas Instantáneas</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Asegura tu mesa en segundos para almuerzos o cenas especiales. Administra y consulta tus reservas desde tu historial.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promotional Callout */}
      <section className="py-16 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl overflow-hidden shadow-premium grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Text content */}
            <div className="p-8 sm:p-12 lg:col-span-7 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider font-extrabold text-primary-orange mb-3">Promoción de la Semana</span>
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-dark mb-4">
                ¡Martes de Lomo Saltado!
              </h3>
              <p className="text-gray-600 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
                Aprovecha hoy un <strong className="text-primary font-bold">20% de descuento directo</strong> en nuestra especialidad criolla tradicional. Servido súper jugoso y al momento.
              </p>
              <div>
                <Link 
                  to="/menu" 
                  className="inline-flex items-center gap-2 bg-primary-orange hover:bg-primary-orange/95 text-white font-bold px-6 py-3.5 rounded-xl shadow-orange-premium transition-all duration-200"
                >
                  Pedir Promoción <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Image section */}
            <div className="h-64 lg:h-auto lg:col-span-5 relative">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80" 
                alt="Lomo Saltado" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
