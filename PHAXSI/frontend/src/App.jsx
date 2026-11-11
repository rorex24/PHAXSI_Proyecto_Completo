import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PrimerosAuxilios } from './pages/PrimerosAuxilios';
import { CrisisPage } from './pages/CrisisPage';

const ProtectedRoute = ({ children }) => {
    const { usuario, cargando } = React.useContext(AuthContext);
    if (cargando) return <div>Cargando...</div>;
    return usuario ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/primeros-auxilios" element={<PrimerosAuxilios />} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                            <Route path="/crisis" element={<ProtectedRoute><CrisisPage /></ProtectedRoute>} />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
