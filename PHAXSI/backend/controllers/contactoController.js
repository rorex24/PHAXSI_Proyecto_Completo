const db = require('../config/db');

exports.obtenerContactos = async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM contactos_emergencia WHERE usuario_id = ? ORDER BY es_prioritario DESC, nombre ASC', [req.usuario.id]);
        res.json(filas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener contactos', error: error.message });
    }
};

exports.crearContacto = async (req, res) => {
    try {
        const { nombre, parentesco, telefono, es_prioritario } = req.body;
        const [resul] = await db.query(
            'INSERT INTO contactos_emergencia (usuario_id, nombre, parentesco, telefono, es_prioritario) VALUES (?, ?, ?, ?, ?)',
            [req.usuario.id, nombre, parentesco, telefono, es_prioritario || false]
        );
        res.status(201).json({ mensaje: 'Contacto guardado exitosamente', id: resul.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar contacto', error: error.message });
    }
};

exports.eliminarContacto = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM contactos_emergencia WHERE id = ? AND usuario_id = ?', [id, req.usuario.id]);
        res.json({ mensaje: 'Contacto eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar contacto', error: error.message });
    }
};
