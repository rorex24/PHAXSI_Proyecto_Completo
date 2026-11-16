import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

// Barra superior pública (sin sesión). Con sesión se usa Sidebar.
export const Navbar = () => {
    return (
        <nav className="navbar" aria-label="Navegación pública">
            <Link to="/" className="logo">
                <Brain size={28} aria-hidden="true" />
                PHAXSI
            </Link>
            <ul className="nav-links">
                <li><Link to="/primeros-auxilios">Primeros Auxilios</Link></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/registro" className="btn btn-primary" style={{ background: '#fff', color: '#2e1065' }}>Registrarse</Link></li>
            </ul>
        </nav>
    );
};
