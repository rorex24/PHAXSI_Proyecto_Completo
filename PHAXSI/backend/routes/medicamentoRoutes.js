const express = require('express');
const router = express.Router();

// Asegúrate de que la ruta hacia tu middleware sea correcta (sube un nivel con ../ si es necesario)
const authMiddleware = require('../middlewares/authMiddleware');

const {
    listarMedicamentos,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento,
    registrarToma
} = require('../controllers/medicamentoController');

// Verificamos que authMiddleware exista antes de usarlo para evitar que falle Express
if (authMiddleware) {
    router.use(authMiddleware);
}

router.get('/', listarMedicamentos);
router.post('/', crearMedicamento);
router.put('/:id', actualizarMedicamento);
router.delete('/:id', eliminarMedicamento);
router.post('/:id/tomar', registrarToma);

module.exports = router;