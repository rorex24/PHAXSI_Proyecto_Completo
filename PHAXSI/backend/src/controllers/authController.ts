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

export {
    registrar,
    login
};