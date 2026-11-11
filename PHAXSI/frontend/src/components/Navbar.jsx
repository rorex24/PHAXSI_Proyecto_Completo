import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Activity, ShieldAlert, Pill, Phone, BookOpen, User, LogOut } from 'lucide-react';

export const Navbar = () => {
    const { usuario, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <Activity color="#2b6cb0" size={28} />
                PHAXSI
            </Link>
            {usuario ? (
                <ul className="nav-links">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/crisis">Crisis</Link></li>
                    <li><Link to="/medicamentos">Medicamentos</Link></li>
                    <li><Link to="/contactos">Contactos</Link></li>
                    <li><Link to="/plan-seguridad">Plan de Seguridad</Link></li>
                    <li><Link to="/primeros-auxilios">Primeros Auxilios</Link></li>
                    <li><Link to="/perfil">Perfil</Link></li>
                    <li>
                        <button onClick={handleLogout} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LogOut size={16} /> Salir
                        </button>
                    </li>
                </ul>
            ) : (
                <ul className="nav-links">
                    <li><Link to="/login">Iniciar Sesión</Link></li>
                    <li><Link to="/registro" className="btn btn-primary">Registrarse</Link></li>
                </ul>
            )}
        </nav>
    );
};
