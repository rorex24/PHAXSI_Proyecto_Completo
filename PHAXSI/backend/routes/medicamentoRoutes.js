const express = require('express');
const router = express.Router();
const medicamentoController = require('../controllers/medicamentoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, medicamentoController.obtenerMedicamentos);
router.post('/', verificarToken, medicamentoController.crearMedicamento);
router.delete('/:id', verificarToken, medicamentoController.eliminarMedicamento);

module.exports = router;
