const db = require('../config/db');

exports.obtenerCrisis = async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM crisis WHERE usuario_id = ? ORDER BY fecha_hora DESC', [req.user.id]);
        res.json(filas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial de crisis', error: error.message });
    }
};

exports.crearCrisis = async (req, res) => {
    try {
        const { fecha_hora, duracion_minutos, tipo_crisis, sintomas, desencadenantes, observaciones } = req.body;
        const [resul] = await db.query(
            'INSERT INTO crisis (usuario_id, fecha_hora, duracion_minutos, tipo_crisis, sintomas, desencadenantes, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, fecha_hora, duracion_minutos, tipo_crisis, sintomas, desencadenantes, observaciones]
        );
        res.status(201).json({ mensaje: 'Crisis registrada exitosamente', id: resul.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar la crisis', error: error.message });
    }
};

exports.eliminarCrisis = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM crisis WHERE id = ? AND usuario_id = ?', [id, req.user.id]);
        res.json({ mensaje: 'Registro de crisis eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar registro de crisis', error: error.message });
    }
};
