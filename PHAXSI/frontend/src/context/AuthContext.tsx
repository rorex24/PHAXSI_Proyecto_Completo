import React, { createContext, useState, useEffect } from 'react';
import { loginUsuario, registrarUsuario } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStored = localStorage.getItem('usuario');
        if (token && userStored) {
            setUsuario(JSON.parse(userStored));
        }
        setCargando(false);
    }, []);

    const login = async (email, password) => {
        const data = await loginUsuario(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setUsuario(data.usuario);
        return data;
    };

    const registrar = async (datos) => {
        return await registrarUsuario(datos);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, registrar, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
};
