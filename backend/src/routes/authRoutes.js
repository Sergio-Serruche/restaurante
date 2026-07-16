const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Rutas Públicas
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

// Rutas Protegidas
router.get('/perfil', authMiddleware(), authController.obtenerPerfil);

module.exports = router;
