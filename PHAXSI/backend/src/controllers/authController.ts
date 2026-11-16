const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
        }

        const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
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
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
        }

        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
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
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = {
    registrar,
    login
};