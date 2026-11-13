import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Perfil = () => {
    const { usuario } = useContext(AuthContext);

    return (
        <div style={{ maxWidth: '500px', margin: '2rem auto' }} className="card">
            <h2 style={{ marginBottom: '1.5rem' }}>Mi perfil</h2>
            <div className="form-group">
                <label>Nombre</label>
                <input className="form-control" value={usuario?.nombre || ''} readOnly />
            </div>
            <div className="form-group">
                <label>Correo electrónico</label>
                <input className="form-control" value={usuario?.email || ''} readOnly />
            </div>
        </div>
    );
};
