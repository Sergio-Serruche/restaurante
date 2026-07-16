const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API REST de Restaurate',
    version: '1.0.0',
    autor: 'Equipo de Desarrollo Restaurate',
    documentacion: '/api/docs (próximamente)'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);

// Manejo de rutas inexistentes
app.use((req, res, next) => {
  res.status(404).json({ mensaje: 'Recurso no encontrado' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

// Levantar Servidor
app.listen(PORT, () => {
  console.log(`Servidor de Restaurate corriendo en http://localhost:${PORT}`);
});

module.exports = app;
