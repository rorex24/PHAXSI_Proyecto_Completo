import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchCrisis, fetchMedicamentos, fetchContactos } from '../services/api';
import { Activity, Pill, Phone, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const { usuario } = useContext(AuthContext);
    const [crisis, setCrisis] = useState([]);
    const [medicamentos, setMedicamentos] = useState([]);
    const [contactos, setContactos] = useState([]);

    useEffect(() => {
        fetchCrisis().then(setCrisis).catch(console.error);
        fetchMedicamentos().then(setMedicamentos).catch(console.error);
        fetchContactos().then(setContactos).catch(console.error);
    }, []);

    return (
        <div>
            <h2>Bienvenido, {usuario?.nombre}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Resumen general de tu estado de salud y contactos.</p>

            <div className="grid-3">
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Activity color="var(--primary-color)" />
                        <h3>Crisis Registradas</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>{crisis.length}</p>
                    <Link to="/crisis" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Ver historial →</Link>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Pill color="var(--secondary-color)" />
                        <h3>Medicamentos Activos</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>{medicamentos.length}</p>
                    <Link to="/medicamentos" style={{ color: 'var(--secondary-color)', fontWeight: '600' }}>Gestionar dósis →</Link>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Phone color="var(--warning-color)" />
                        <h3>Contactos de Emergencia</h3>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>{contactos.length}</p>
                    <Link to="/contactos" style={{ color: 'var(--warning-color)', fontWeight: '600' }}>Ver contactos →</Link>
                </div>
            </div>
        </div>
    );
};
