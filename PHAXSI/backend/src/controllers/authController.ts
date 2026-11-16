import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import type { Request, Response } from 'express';
import db from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registrar = async (req: Request, res: Response) => {
    try {
        const { nombre, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
        }

        const [existing] = await db.query<RowDataPacket[]>('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre || '', email, hashedPassword]
        );

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: (error as Error).message });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
        }

        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const usuario = rows[0];
        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({ mensaje: 'Login exitoso', token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: (error as Error).message });
    }
};

const TIPOS_SANGRE = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const COLUMNAS_PERFIL =
    "id, nombre, email, rol, telefono, DATE_FORMAT(fecha_nacimiento, '%Y-%m-%d') AS fecha_nacimiento, tipo_sangre, condiciones_adicionales, alergias, contacto_medico, creado_en";

// Perfil del usuario autenticado (nunca devuelve la contraseña).
const obtenerPerfil = async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS_PERFIL} FROM usuarios WHERE id = ?`, [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error al obtener el perfil', error: (error as Error).message });
    }
};

const actualizarPerfil = async (req: Request, res: Response) => {
    try {
        const { nombre, telefono, fecha_nacimiento, tipo_sangre, condiciones_adicionales, alergias, contacto_medico } = req.body;

        if (typeof nombre !== 'string' || !nombre.trim()) {
            return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
        }
        if (nombre.trim().length > 100) {
            return res.status(400).json({ mensaje: 'El nombre no puede superar 100 caracteres' });
        }

        const tel = typeof telefono === 'string' ? telefono.trim() : '';
        if (tel && !/^\+?[0-9\s-]{7,30}$/.test(tel)) {
            return res.status(400).json({ mensaje: 'Formato de teléfono inválido (ej. +591 70000000)' });
        }

        const sangre = typeof tipo_sangre === 'string' ? tipo_sangre.trim() : '';
        if (!TIPOS_SANGRE.includes(sangre)) {
            return res.status(400).json({ mensaje: 'Tipo de sangre inválido' });
        }

        let fecha: string | null = null;
        if (typeof fecha_nacimiento === 'string' && fecha_nacimiento.trim()) {
            const f = fecha_nacimiento.trim();
            const d = new Date(`${f}T00:00:00`);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(f) || isNaN(d.getTime()) || d > new Date() || d.getFullYear() < 1900) {
                return res.status(400).json({ mensaje: 'Fecha de nacimiento inválida' });
            }
            fecha = f;
        }

        const texto = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
        const condiciones = texto(condiciones_adicionales);
        const alerg = texto(alergias);
        const medico = texto(contacto_medico);
        if (condiciones.length > 2000 || alerg.length > 2000 || medico.length > 2000) {
            return res.status(400).json({ mensaje: 'Los textos no pueden superar 2000 caracteres' });
        }

        await db.query(
            `UPDATE usuarios SET nombre = ?, telefono = ?, fecha_nacimiento = ?, tipo_sangre = ?,
             condiciones_adicionales = ?, alergias = ?, contacto_medico = ? WHERE id = ?`,
            [nombre.trim(), tel || null, fecha, sangre || null, condiciones || null, alerg || null, medico || null, req.user.id]
        );

        const [rows] = await db.query<RowDataPacket[]>(`SELECT ${COLUMNAS_PERFIL} FROM usuarios WHERE id = ?`, [req.user.id]);
        res.json({ mensaje: 'Perfil actualizado exitosamente', perfil: rows[0] });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el perfil', error: (error as Error).message });
    }
};

export {
    registrar,
    login,
    obtenerPerfil,
    actualizarPerfil
};