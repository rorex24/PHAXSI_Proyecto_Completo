const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, contactoController.obtenerContactos);
router.post('/', verificarToken, contactoController.crearContacto);
router.delete('/:id', verificarToken, contactoController.eliminarContacto);

module.exports = router;
