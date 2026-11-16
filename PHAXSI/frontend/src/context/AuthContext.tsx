import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { loginUsuario, registrarUsuario } from '../services/api';
import type { LoginResponse, RegistroPayload, Usuario } from '../types';

export interface AuthContextType {
    usuario: Usuario | null;
    login: (email: string, password: string) => Promise<LoginResponse>;
    registrar: (datos: RegistroPayload) => Promise<unknown>;
    logout: () => void;
    /** Actualiza los datos básicos de la sesión (p. ej. el nombre tras editar el perfil). */
    actualizarUsuario: (datos: Partial<Usuario>) => void;
    cargando: boolean;
}

export const AuthContext = createContext<AuthContextType>(null as unknown as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStored = localStorage.getItem('usuario');
        if (token && userStored) {
            setUsuario(JSON.parse(userStored));
        }
        setCargando(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginUsuario(email, password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        setUsuario(data.usuario);
        return data;
    };

    const registrar = async (datos: RegistroPayload) => {
        return await registrarUsuario(datos);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
    };

    const actualizarUsuario = (datos: Partial<Usuario>) => {
        setUsuario(prev => {
            if (!prev) return prev;
            const nuevo = { ...prev, ...datos };
            localStorage.setItem('usuario', JSON.stringify(nuevo));
            return nuevo;
        });
    };

    return (
        <AuthContext.Provider value={{ usuario, login, registrar, logout, actualizarUsuario, cargando }}>
            {children}
        </AuthContext.Provider>
    );
};
