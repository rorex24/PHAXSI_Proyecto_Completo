import React, { useContext, type ReactNode } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

// Con sesión: barra lateral. Sin sesión: barra superior pública mínima.
export default function AppLayout({ children }: { children: ReactNode }) {
    const { usuario } = useContext(AuthContext);

    return (
        <div className={`app-container${usuario ? ' with-sidebar' : ''}`}>
            <a href="#contenido-principal" className="skip-link">Saltar al contenido</a>
            {usuario ? <Sidebar /> : <Navbar />}
            <main id="contenido-principal" className="main-content" tabIndex={-1}>
                {children}
            </main>
        </div>
    );
}
