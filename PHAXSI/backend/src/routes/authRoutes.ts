import express from 'express';
const router = express.Router();
import { registrar, login, obtenerPerfil, actualizarPerfil } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', authMiddleware, obtenerPerfil);
router.put('/perfil', authMiddleware, actualizarPerfil);

export default router;
