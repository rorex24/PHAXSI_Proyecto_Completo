const express = require('express');
const router = express.Router();
const crisisController = require('../controllers/crisisController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, crisisController.obtenerCrisis);
router.post('/', verificarToken, crisisController.crearCrisis);
router.delete('/:id', verificarToken, crisisController.eliminarCrisis);

module.exports = router;
