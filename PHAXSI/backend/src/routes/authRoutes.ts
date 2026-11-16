import express from 'express';
const router = express.Router();
import { registrar, login } from '../controllers/authController';

router.post('/registro', registrar);
router.post('/login', login);

export default router;