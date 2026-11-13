const db = require('../config/db');

const listarMedicamentos = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const [rows] = await db.query(
            'SELECT id, usuario_id, nombre_medicamento AS nombre, dosis, frecuencia, horarios, instrucciones AS indicaciones, activo, creado_en FROM medicamentos WHERE usuario_id = ? ORDER BY id DESC',
            [usuario_id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al listar medicamentos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los medicamentos', error: error.message });
    }
};

const crearMedicamento = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { nombre, dosis, frecuencia, horarios, indicaciones } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ mensaje: 'El nombre del medicamento es obligatorio' });
        }

        const [result] = await db.query(
            'INSERT INTO medicamentos (usuario_id, nombre_medicamento, dosis, frecuencia, horarios, instrucciones) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, nombre, dosis || '', frecuencia || '', horarios || '', indicaciones || '']
        );

        res.status(201).json({ mensaje: 'Medicamento creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error('Error al crear medicamento:', error);
        res.status(500).json({ mensaje: 'Error al crear el medicamento', error: error.message });
    }
};

const actualizarMedicamento = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const { nombre, dosis, frecuencia, horarios, indicaciones } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ mensaje: 'El nombre del medicamento es obligatorio' });
        }

        const [existing] = await db.query('SELECT * FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (existing.length === 0) {
            return res.status(404).json({ mensaje: 'Medicamento no encontrado o sin permisos' });
        }

        await db.query(
            'UPDATE medicamentos SET nombre_medicamento = ?, dosis = ?, frecuencia = ?, horarios = ?, instrucciones = ? WHERE id = ? AND usuario_id = ?',
            [nombre, dosis || '', frecuencia || '', horarios || '', indicaciones || '', id, usuario_id]
        );

        res.json({ mensaje: 'Medicamento actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar medicamento:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el medicamento', error: error.message });
    }
};

const eliminarMedicamento = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (existing.length === 0) {
            return res.status(404).json({ mensaje: 'Medicamento no encontrado o sin permisos' });
        }

        await db.query('DELETE FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        res.json({ mensaje: 'Medicamento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el medicamento', error: error.message });
    }
};

const registrarToma = async (req, res) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const fecha_hora = new Date();

        const [existing] = await db.query('SELECT * FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (existing.length === 0) {
            return res.status(404).json({ mensaje: 'Medicamento no encontrado o sin permisos' });
        }

        await db.query(
            'INSERT INTO registros_medicamentos (medicamento_id, fecha_hora) VALUES (?, ?)',
            [id, fecha_hora]
        );

        res.status(201).json({ mensaje: 'Toma registrada exitosamente', fecha_hora });
    } catch (error) {
        console.error('Error al registrar toma:', error);
        res.status(500).json({ mensaje: 'Error al registrar la toma', error: error.message });
    }
};

module.exports = {
    listarMedicamentos,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento,
    registrarToma
};