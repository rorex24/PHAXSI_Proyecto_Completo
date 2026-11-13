const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
    listarContactos,
    crearContacto,
    actualizarContacto,
    eliminarContacto
} = require('../controllers/contactoController');

router.use(authMiddleware);

router.get('/', listarContactos);
router.post('/', crearContacto);
router.put('/:id', actualizarContacto);
router.delete('/:id', eliminarContacto);

// DEBE SER EXACTAMENTE ESTO (sin llaves alrededor)
module.exports = router;