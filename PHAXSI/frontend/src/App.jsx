import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PrimerosAuxilios } from './pages/PrimerosAuxilios';
import { CrisisPage } from './pages/CrisisPage';
import MedicamentosPage from './pages/MedicamentoPage';
import ContactosPage from './pages/ContactosPage';
import PlanSeguridadPage from './pages/PlanSeguridad';

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <ErrorBoundary>
                    <div className="app-container">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/primeros-auxilios" element={<PrimerosAuxilios />} />
                                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/crisis" element={<ProtectedRoute><CrisisPage /></ProtectedRoute>} />
                                <Route path="/medicamentos" element={<ProtectedRoute><MedicamentosPage /></ProtectedRoute>} />
                                <Route path="/contactos" element={<ProtectedRoute><ContactosPage /></ProtectedRoute>} />
                                <Route path="/plan-seguridad" element={<ProtectedRoute><PlanSeguridadPage /></ProtectedRoute>} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="*" element={<div style={{ padding: '2rem' }}><h2>404 - Página no encontrada</h2></div>} />
                            </Routes>
                        </main>
                    </div>
                </ErrorBoundary>
            </Router>
        </AuthProvider>
    );
}
