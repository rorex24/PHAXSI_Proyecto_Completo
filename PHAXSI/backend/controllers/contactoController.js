const db = require('../config/db');

exports.listarContactos = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM contactos_emergencia WHERE usuario_id = ? ORDER BY es_principal DESC, id DESC',
            [usuario_id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al listar contactos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los contactos de emergencia', error: error.message });
    }
};

exports.crearContacto = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { nombre, parentesco, telefono, es_principal } = req.body;

        if (!nombre || !nombre.trim() || !telefono || !telefono.trim()) {
            return res.status(400).json({ mensaje: 'El nombre y el teléfono son obligatorios' });
        }

        const principalFlag = es_principal ? 1 : 0;

        if (principalFlag === 1) {
            await db.query('UPDATE contactos_emergencia SET es_principal = 0 WHERE usuario_id = ?', [usuario_id]);
        }

        const [result] = await db.query(
            'INSERT INTO contactos_emergencia (usuario_id, nombre, parentesco, telefono, es_principal) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, nombre, parentesco || '', telefono, principalFlag]
        );

        res.status(201).json({ mensaje: 'Contacto creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error('Error al crear contacto:', error);
        res.status(500).json({ mensaje: 'Error al crear el contacto', error: error.message });
    }
};

exports.actualizarContacto = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const { nombre, parentesco, telefono, es_principal } = req.body;

        if (!nombre || !nombre.trim() || !telefono || !telefono.trim()) {
            return res.status(400).json({ mensaje: 'El nombre y el teléfono son obligatorios' });
        }

        const [existing] = await db.query('SELECT * FROM contactos_emergencia WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (existing.length === 0) {
            return res.status(404).json({ mensaje: 'Contacto no encontrado o sin permisos' });
        }

        const principalFlag = es_principal ? 1 : 0;

        if (principalFlag === 1) {
            await db.query('UPDATE contactos_emergencia SET es_principal = 0 WHERE usuario_id = ?', [usuario_id]);
        }

        await db.query(
            'UPDATE contactos_emergencia SET nombre = ?, parentesco = ?, telefono = ?, es_principal = ? WHERE id = ? AND usuario_id = ?',
            [nombre, parentesco || '', telefono, principalFlag, id, usuario_id]
        );

        res.json({ mensaje: 'Contacto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar contacto:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el contacto', error: error.message });
    }
};

exports.eliminarContacto = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM contactos_emergencia WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (existing.length === 0) {
            return res.status(404).json({ mensaje: 'Contacto no encontrado o sin permisos' });
        }

        await db.query('DELETE FROM contactos_emergencia WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        res.json({ mensaje: 'Contacto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el contacto', error: error.message });
    }
};
