import express from 'express';
const router = express.Router();

// Asegúrate de que la ruta hacia tu middleware sea correcta (sube un nivel con ../ si es necesario)
import authMiddleware from '../middlewares/authMiddleware';

import {
    listarMedicamentos,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento,
    registrarToma,
    listarTomas
} from '../controllers/medicamentoController';

// Verificamos que authMiddleware exista antes de usarlo para evitar que falle Express
if (authMiddleware) {
    router.use(authMiddleware);
}

router.get('/', listarMedicamentos);
router.get('/tomas', listarTomas);
router.post('/', crearMedicamento);
router.put('/:id', actualizarMedicamento);
router.delete('/:id', eliminarMedicamento);
router.post('/:id/tomar', registrarToma);

export default router;