const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const crisisRoutes = require('./routes/crisisRoutes');
const medicamentoRoutes = require('./routes/medicamentoRoutes');
const contactoRoutes = require('./routes/contactoRoutes');
const planSeguridadRoutes = require('./routes/planSeguridadRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Registro de rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/crisis', crisisRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/contactos', contactoRoutes);
app.use('/api/plan-seguridad', planSeguridadRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'Bienvenido a la API REST del Proyecto PHAXSI' });
});

module.exports = app;