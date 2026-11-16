import React, { useState, useEffect } from 'react';
import { fetchCrisis, crearCrisis } from '../services/api';

export const CrisisPage = () => {
    const [crisisList, setCrisisList] = useState([]);
    const [formData, setFormData] = useState({
        fecha_hora: '',
        duracion_minutos: 1,
        tipo_crisis: 'Tónico-Clónica',
        sintomas: '',
        desencadenantes: '',
        observaciones: ''
    });

    useEffect(() => {
        cargarCrisis();
    }, []);

    const cargarCrisis = async () => {
        const datos = await fetchCrisis();
        setCrisisList(datos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await crearCrisis(formData);
        setFormData({ fecha_hora: '', duracion_minutos: 1, tipo_crisis: 'Tónico-Clónica', sintomas: '', desencadenantes: '', observaciones: '' });
        cargarCrisis();
    };

    return (
        <div>
            <h2>Registro de Crisis Epilépticas</h2>
            <div className="grid-2" style={{ marginTop: '1.5rem' }}>
                <form onSubmit={handleSubmit} className="card">
                    <h3>Registrar Nueva Crisis</h3>
                    <div className="form-group">
                        <label>Fecha y Hora</label>
                        <input type="datetime-local" className="form-control" value={formData.fecha_hora} onChange={e => setFormData({...formData, fecha_hora: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Duración (minutos)</label>
                        <input type="number" min="1" className="form-control" value={formData.duracion_minutos} onChange={e => setFormData({...formData, duracion_minutos: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Tipo de Crisis</label>
                        <select className="form-control" value={formData.tipo_crisis} onChange={e => setFormData({...formData, tipo_crisis: e.target.value})}>
                            <option value="Tónico-Clónica">Tónico-Clónica Generalizada</option>
                            <option value="Ausencia">Ausencia</option>
                            <option value="Focal">Focal</option>
                            <option value="Mioclónica">Mioclónica</option>
                            <option value="Atonica">Atónica</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Síntomas</label>
                        <textarea className="form-control" value={formData.sintomas} onChange={e => setFormData({...formData, sintomas: e.target.value})} placeholder="Rigidez, aura previa, etc."></textarea>
                    </div>
                    <div className="form-group">
                        <label>Posibles Desencadenantes</label>
                        <input type="text" className="form-control" value={formData.desencadenantes} onChange={e => setFormData({...formData, desencadenantes: e.target.value})} placeholder="Falta de sueño, luces, estrés..." />
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar Registro</button>
                </form>

                <div>
                    <h3>Historial de Eventos</h3>
                    {crisisList.map(c => (
                        <div key={c.id} className="card">
                            <h4>{c.tipo_crisis} ({c.duracion_minutos} min)</h4>
                            <p><strong>Fecha:</strong> {new Date(c.fecha_hora).toLocaleString()}</p>
                            <p><strong>Síntomas:</strong> {c.sintomas || 'N/A'}</p>
                            <p><strong>Desencadenantes:</strong> {c.desencadenantes || 'N/A'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
