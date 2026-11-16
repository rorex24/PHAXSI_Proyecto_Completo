import express from 'express';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddleware';
import {
    listarContactos,
    crearContacto,
    actualizarContacto,
    eliminarContacto
} from '../controllers/contactoController';

router.use(authMiddleware);

router.get('/', listarContactos);
router.post('/', crearContacto);
router.put('/:id', actualizarContacto);
router.delete('/:id', eliminarContacto);

// DEBE SER EXACTAMENTE ESTO (sin llaves alrededor)
export default router;