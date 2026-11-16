import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

interface Props {
    nombre?: string;
}

export const DashboardHeader = ({ nombre }: Props) => {
    const primerNombre = (nombre || '').trim().split(/\s+/)[0];

    return (
        <header className="dash-header">
            <div>
                <h1 className="dash-title">¡Hola{primerNombre ? `, ${primerNombre}` : ''}!</h1>
                <p className="dash-subtitle">Aquí tienes un resumen de tu actividad y estado de salud.</p>
            </div>
            <Link to="/perfil" className="dash-profile-link" aria-label="Ir a mi perfil">
                <UserCircle size={28} aria-hidden="true" />
                <span>Mi perfil</span>
            </Link>
        </header>
    );
};
