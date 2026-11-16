const express = require('express');
const router = express.Router();
const crisisController = require('../controllers/crisisController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, crisisController.obtenerCrisis);
router.post('/', authMiddleware, crisisController.crearCrisis);
router.delete('/:id', authMiddleware, crisisController.eliminarCrisis);

module.exports = router;
