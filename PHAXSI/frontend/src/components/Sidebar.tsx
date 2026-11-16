import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Brain, Home, ClipboardPlus, History, Pill, LifeBuoy, Phone, User, LogOut, Menu, X } from 'lucide-react';

interface Item {
    key: string;
    to: string;
    label: string;
    icon: React.ReactNode;
}

const ITEMS: Item[] = [
    { key: 'inicio', to: '/dashboard', label: 'Inicio', icon: <Home size={20} aria-hidden="true" /> },
    { key: 'registro', to: '/crisis', label: 'Registro de crisis', icon: <ClipboardPlus size={20} aria-hidden="true" /> },
    { key: 'historial', to: '/crisis#historial', label: 'Historial', icon: <History size={20} aria-hidden="true" /> },
    { key: 'medicamentos', to: '/medicamentos', label: 'Medicamentos', icon: <Pill size={20} aria-hidden="true" /> },
    { key: 'auxilios', to: '/primeros-auxilios', label: 'Guía de primeros auxilios', icon: <LifeBuoy size={20} aria-hidden="true" /> },
    { key: 'contactos', to: '/contactos', label: 'Contactos de emergencia', icon: <Phone size={20} aria-hidden="true" /> },
    { key: 'perfil', to: '/perfil', label: 'Mi perfil', icon: <User size={20} aria-hidden="true" /> }
];

export const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [abierto, setAbierto] = useState(false);

    // Cierra el menú móvil al navegar
    useEffect(() => {
        setAbierto(false);
    }, [location.pathname, location.hash]);

    // Escape cierra el menú móvil
    useEffect(() => {
        if (!abierto) return;
        const alTeclear = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setAbierto(false);
        };
        document.addEventListener('keydown', alTeclear);
        return () => document.removeEventListener('keydown', alTeclear);
    }, [abierto]);

    // Desplaza a #historial cuando corresponde (CrisisPage no se modifica en su lógica)
    useEffect(() => {
        if (location.pathname === '/crisis' && location.hash === '#historial') {
            const el = document.getElementById('historial');
            if (el) el.scrollIntoView({ block: 'start' });
        }
    }, [location.pathname, location.hash]);

    const esActivo = (item: Item): boolean => {
        if (item.key === 'historial') return location.pathname === '/crisis' && location.hash === '#historial';
        if (item.key === 'registro') return location.pathname === '/crisis' && location.hash !== '#historial';
        return location.pathname === item.to;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className="mobile-bar">
                <button
                    type="button"
                    className="mobile-bar-btn"
                    onClick={() => setAbierto(true)}
                    aria-label="Abrir menú de navegación"
                    aria-expanded={abierto}
                    aria-controls="sidebar-principal"
                >
                    <Menu size={24} aria-hidden="true" />
                    <span>Menú</span>
                </button>
                <span className="mobile-bar-title">PHAXSI</span>
            </div>

            <div className={`sidebar-backdrop${abierto ? ' open' : ''}`} onClick={() => setAbierto(false)} aria-hidden="true" />

            <aside id="sidebar-principal" className={`sidebar${abierto ? ' open' : ''}`} aria-label="Barra lateral">
                <div className="sidebar-brand">
                    <Link to="/dashboard" className="sidebar-brand-icon" aria-label="PHAXSI, ir al inicio">
                        <Brain size={28} aria-hidden="true" />
                    </Link>
                    <div>
                        <span className="sidebar-brand-name">PHAXSI</span>
                        <span className="sidebar-brand-tagline">Tu compañero en el camino</span>
                    </div>
                    {abierto && (
                        <button
                            type="button"
                            className="mobile-bar-btn"
                            style={{ marginLeft: 'auto' }}
                            onClick={() => setAbierto(false)}
                            aria-label="Cerrar menú de navegación"
                        >
                            <X size={22} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <nav className="sidebar-nav" aria-label="Navegación principal">
                    <ul>
                        {ITEMS.map(item => (
                            <li key={item.key}>
                                <NavLink
                                    to={item.to}
                                    className={`sidebar-link${esActivo(item) ? ' active' : ''}`}
                                    aria-current={esActivo(item) ? 'page' : undefined}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button type="button" className="sidebar-logout" onClick={handleLogout}>
                        <LogOut size={20} aria-hidden="true" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
