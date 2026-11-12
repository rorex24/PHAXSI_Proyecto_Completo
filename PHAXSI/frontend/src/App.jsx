import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import MedicamentosPage from './pages/MedicamentosPage';
import ContactosPage from './pages/ContactosPage';
import PlanSeguridadPage from './pages/PlanSeguridadPage';
import './styles/App.css';

export default function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <div className="phaxsi-layout">
                    <header className="phaxsi-header">
                        <h1>PHAXSI</h1>
                        <nav className="phaxsi-nav">
                            <NavLink to="/medicamentos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Medicamentos
                            </NavLink>
                            <NavLink to="/contactos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Contactos
                            </NavLink>
                            <NavLink to="/plan-seguridad" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Plan de seguridad
                            </NavLink>
                        </nav>
                    </header>
                    <main className="phaxsi-main">
                        <Routes>
                            <Route path="/" element={<Navigate to="/medicamentos" replace />} />
                            <Route path="/medicamentos" element={
                                <ProtectedRoute>
                                    <MedicamentosPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/contactos" element={
                                <ProtectedRoute>
                                    <ContactosPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/plan-seguridad" element={
                                <ProtectedRoute>
                                    <PlanSeguridadPage />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<div style={{ padding: '2rem' }}><h2>404 - Página no encontrada</h2></div>} />
                        </Routes>
                    </main>
                </div>
            </ErrorBoundary>
        </BrowserRouter>
    );
}