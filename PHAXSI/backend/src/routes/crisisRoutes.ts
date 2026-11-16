import express from 'express';
const router = express.Router();
import * as crisisController from '../controllers/crisisController';
import authMiddleware from '../middlewares/authMiddleware';

router.get('/', authMiddleware, crisisController.obtenerCrisis);
router.post('/', authMiddleware, crisisController.crearCrisis);
router.delete('/:id', authMiddleware, crisisController.eliminarCrisis);

export default router;
