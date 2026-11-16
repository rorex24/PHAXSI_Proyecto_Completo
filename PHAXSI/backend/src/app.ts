import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import crisisRoutes from './routes/crisisRoutes';
import medicamentoRoutes from './routes/medicamentoRoutes';
import contactoRoutes from './routes/contactoRoutes';
import planSeguridadRoutes from './routes/planSeguridadRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Registro de rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/plan-seguridad', planSeguridadRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ mensaje: 'Bienvenido a la API REST del Proyecto PHAXSI' });
});

export default app;