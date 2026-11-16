import express from 'express';
const router = express.Router();
import authMiddleware from '../middlewares/authMiddleware';
import { obtenerPlan, guardarPlan } from '../controllers/planSeguridadController';

router.use(authMiddleware);

router.get('/', obtenerPlan);
router.put('/', guardarPlan);

export default router;