const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas Protegidas para Clientes
router.post('/', authMiddleware('cliente'), orderController.crearPedido);
router.get('/mis-pedidos', authMiddleware('cliente'), orderController.obtenerMisPedidos);

// Rutas Protegidas para Administradores o Personal de Cocina
router.get('/', authMiddleware(['administrador', 'cocinero']), orderController.obtenerTodosLosPedidos);
router.patch('/:id/estado', authMiddleware(['administrador', 'cocinero']), orderController.actualizarEstadoPedido);

module.exports = router;
