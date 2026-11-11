const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, rol, telefono } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Por favor complete todos los campos obligatorios.' });
        }

        const [existe] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existe.length > 0) {
            return res.status(400).json({ mensaje: 'El correo electrónico ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [resultado] = await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol, telefono) VALUES (?, ?, ?, ?, ?)',
            [nombre, email, passwordHash, rol || 'paciente', telefono || '']
        );

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuarioId: resultado.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor al registrar usuario', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const usuario = usuarios[0];
        const esCorrecto = await bcrypt.compare(password, usuario.password);
        if (!esCorrecto) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol, nombre: usuario.nombre },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        delete usuario.password;
        res.json({ mensaje: 'Inicio de sesión exitoso', token, usuario });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
};

exports.obtenerPerfil = async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT id, nombre, email, rol, telefono, fecha_nacimiento, tipo_sangre, condiciones_adicionales, alergias, contacto_medico FROM usuarios WHERE id = ?', [req.usuario.id]);
        if (usuarios.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        res.json(usuarios[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos de perfil', error: error.message });
    }
};

exports.actualizarPerfil = async (req, res) => {
    try {
        const { nombre, telefono, fecha_nacimiento, tipo_sangre, alergias, contacto_medico } = req.body;
        await db.query(
            'UPDATE usuarios SET nombre=?, telefono=?, fecha_nacimiento=?, tipo_sangre=?, alergias=?, contacto_medico=? WHERE id=?',
            [nombre, telefono, fecha_nacimiento, tipo_sangre, alergias, contacto_medico, req.usuario.id]
        );
        res.json({ mensaje: 'Perfil médico actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
    }
};
