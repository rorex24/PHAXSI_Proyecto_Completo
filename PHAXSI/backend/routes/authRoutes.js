const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/registro', authController.registrar);
router.post('/login', authController.login);
router.get('/perfil', verificarToken, authController.obtenerPerfil);
router.put('/perfil', verificarToken, authController.actualizarPerfil);

module.exports = router;
