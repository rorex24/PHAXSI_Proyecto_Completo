import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Registro = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const { registrar } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setExito('');

        if (password !== confirmar) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            await registrar({ nombre, email, password });
            setExito('Cuenta creada. Redirigiendo al inicio de sesión...');
            setTimeout(() => navigate('/login'), 1200);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Crear cuenta en PHAXSI</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {exito && <div style={{ color: 'green', marginBottom: '1rem' }}>{exito}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} minLength={4} required />
                </div>
                <div className="form-group">
                    <label>Confirmar contraseña</label>
                    <input type="password" className="form-control" value={confirmar} onChange={e => setConfirmar(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Registrarse</button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
        </div>
    );
};
