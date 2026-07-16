const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas Públicas
router.get('/categorias', productController.obtenerCategorias);
router.get('/', productController.obtenerProductos);

// Rutas Protegidas (Administrador / Cocinero)
router.post('/', authMiddleware('administrador'), productController.crearProducto);
router.put('/:id', authMiddleware('administrador'), productController.actualizarProducto);
router.delete('/:id', authMiddleware('administrador'), productController.eliminarProducto);
router.patch('/:id/disponibilidad', authMiddleware(['administrador', 'cocinero']), productController.actualizarDisponibilidad);

// Rutas de Ingresos (Administrador)
router.post('/ingresos', authMiddleware('administrador'), productController.registrarIngreso);
router.get('/ingresos', authMiddleware('administrador'), productController.obtenerIngresos);

module.exports = router;
