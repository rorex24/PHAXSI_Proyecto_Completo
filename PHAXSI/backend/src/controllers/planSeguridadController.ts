const db = require('../config/db');

const obtenerPlan = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const [rows] = await db.query('SELECT * FROM plan_seguridad WHERE usuario_id = ?', [usuario_id]);
        
        if (rows.length === 0) {
            return res.json({
                pasos_crisis: '',
                cuando_llamar: '',
                desencadenantes: '',
                medico_nombre: '',
                medico_telefono: '',
                hospital_referencia: '',
                notas: ''
            });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener plan de seguridad:', error);
        res.status(500).json({ mensaje: 'Error al obtener el plan de seguridad', error: error.message });
    }
};

const guardarPlan = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const {
            pasos_crisis,
            cuando_llamar,
            desencadenantes,
            medico_nombre,
            medico_telefono,
            hospital_referencia,
            notas
        } = req.body;

        const [existing] = await db.query('SELECT id FROM plan_seguridad WHERE usuario_id = ?', [usuario_id]);

        if (existing.length === 0) {
            await db.query(
                `INSERT INTO plan_seguridad (usuario_id, pasos_crisis, cuando_llamar, desencadenantes, medico_nombre, medico_telefono, hospital_referencia, notas)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [usuario_id, pasos_crisis || '', cuando_llamar || '', desencadenantes || '', medico_nombre || '', medico_telefono || '', hospital_referencia || '', notas || '']
            );
        } else {
            await db.query(
                `UPDATE plan_seguridad SET pasos_crisis = ?, cuando_llamar = ?, desencadenantes = ?, medico_nombre = ?, medico_telefono = ?, hospital_referencia = ?, notas = ?
                 WHERE usuario_id = ?`,
                [pasos_crisis || '', cuando_llamar || '', desencadenantes || '', medico_nombre || '', medico_telefono || '', hospital_referencia || '', notas || '', usuario_id]
            );
        }

        res.json({ mensaje: 'Plan de seguridad guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar plan de seguridad:', error);
        res.status(500).json({ mensaje: 'Error al guardar el plan de seguridad', error: error.message });
    }
};

module.exports = {
    obtenerPlan,
    guardarPlan
};