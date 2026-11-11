const db = require('../config/db');

exports.obtenerMedicamentos = async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM medicamentos WHERE usuario_id = ? AND activo = TRUE ORDER BY creado_en DESC', [req.usuario.id]);
        res.json(filas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener medicamentos', error: error.message });
    }
};

exports.crearMedicamento = async (req, res) => {
    try {
        const { nombre_medicamento, dosis, frecuencia, horarios, instrucciones } = req.body;
        const [resul] = await db.query(
            'INSERT INTO medicamentos (usuario_id, nombre_medicamento, dosis, frecuencia, horarios, instrucciones) VALUES (?, ?, ?, ?, ?, ?)',
            [req.usuario.id, nombre_medicamento, dosis, frecuencia, horarios, instrucciones]
        );
        res.status(201).json({ mensaje: 'Medicamento registrado', id: resul.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar medicamento', error: error.message });
    }
};

exports.eliminarMedicamento = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE medicamentos SET activo = FALSE WHERE id = ? AND usuario_id = ?', [id, req.usuario.id]);
        res.json({ mensaje: 'Medicamento desactivado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar medicamento', error: error.message });
    }
};
