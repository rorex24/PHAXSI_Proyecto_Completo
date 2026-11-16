const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { obtenerPlan, guardarPlan } = require('../controllers/planSeguridadController');

router.use(authMiddleware);

router.get('/', obtenerPlan);
router.put('/', guardarPlan);

module.exports = router;