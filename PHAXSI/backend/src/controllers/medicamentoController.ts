import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Request, Response } from 'express';
import db from '../config/db';

const listarMedicamentos = async (req: Request, res: Response) => {
    try {
        const usuario_id = req.user.id;
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT id, usuario_id, nombre_medicamento AS nombre, dosis, frecuencia, horarios, instrucciones AS indicaciones, activo, creado_en FROM medicamentos WHERE usuario_id = ? ORDER BY id DESC',
            [usuario_id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al listar medicamentos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los medicamentos', error: (error as Error).message });
    }
};

const crearMedicamento = async (req: Request, res: Response) => {
    try {
        const usuario_id = req.user.id;
        const { nombre, dosis, frecuencia, horarios, indicaciones } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ mensaje: 'El nombre del medicamento es obligatorio' });
        }

        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO medicamentos (usuario_id, nombre_medicamento, dosis, frecuencia, horarios, instrucciones) VALUES (?, ?, ?, ?, ?, ?)',
            [usuario_id, nombre, dosis || '', frecuencia || '', horarios || '', indicaciones || '']
        );

        res.status(201).json({ mensaje: 'Medicamento creado exitosamente', id: result.insertId });
    } catch (error) {
        console.error('Error al crear medicamento:', error);
        res.status(500).json({ mensaje: 'Error al crear el medicamento', error: (error as Error).message });
    }
};

const actualizarMedicamento = async (req: Request, res: Response) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const { nombre, dosis, frecuencia, horarios, indicaciones } = req.body;

        if (!nombre || !nombre.trim()) {
            return res.status(400).json({ mensaje: 'El nombre del medicamento es obligatorio' });
        }

        const [existing] = await db.query<RowDataPacket[]>('SELECT * FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
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
        res.status(500).json({ mensaje: 'Error al actualizar el medicamento', error: (error as Error).message });
    }
};

const eliminarMedicamento = async (req: Request, res: Response) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;

        const [existing] = await db.query<RowDataPacket[]>('SELECT * FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (existing.length === 0) {
            return res.status(404).json({ mensaje: 'Medicamento no encontrado o sin permisos' });
        }

        await db.query('DELETE FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        res.json({ mensaje: 'Medicamento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar medicamento:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el medicamento', error: (error as Error).message });
    }
};

const registrarToma = async (req: Request, res: Response) => {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const fecha_hora = new Date();

        const [existing] = await db.query<RowDataPacket[]>('SELECT * FROM medicamentos WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
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
        res.status(500).json({ mensaje: 'Error al registrar la toma', error: (error as Error).message });
    }
};

// Solo lectura: tomas registradas desde una fecha (por defecto, desde las 00:00 de hoy del servidor).
// El cliente envía ?desde=<ISO> con su medianoche local para evitar desfases de zona horaria.
const listarTomas = async (req: Request, res: Response) => {
    try {
        const usuario_id = req.user.id;
        let desde = new Date();
        if (typeof req.query.desde === 'string' && req.query.desde) {
            desde = new Date(req.query.desde);
            if (isNaN(desde.getTime())) {
                return res.status(400).json({ mensaje: 'Parámetro "desde" inválido' });
            }
        } else {
            desde.setHours(0, 0, 0, 0);
        }

        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT r.id, r.medicamento_id, r.fecha_hora, r.tomado
             FROM registros_medicamentos r
             INNER JOIN medicamentos m ON m.id = r.medicamento_id
             WHERE m.usuario_id = ? AND r.fecha_hora >= ?
             ORDER BY r.fecha_hora DESC`,
            [usuario_id, desde]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al listar tomas:', error);
        res.status(500).json({ mensaje: 'Error al obtener las tomas', error: (error as Error).message });
    }
};

export {
    listarTomas,
    listarMedicamentos,
    crearMedicamento,
    actualizarMedicamento,
    eliminarMedicamento,
    registrarToma
};