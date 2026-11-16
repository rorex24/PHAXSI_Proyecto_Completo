import type { Contacto, ContactoPayload, Crisis, CrisisPayload, LoginResponse, Medicamento, MedicamentoPayload, PlanSeguridad, RegistroPayload, RegistroToma } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.14:5000/api';

const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const handleResponse = async <T = any>(res: Response): Promise<T> => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.mensaje || 'Error en la solicitud');
    return data as T;
};

export const loginUsuario = async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error en inicio de sesión');
    return data;
};

export const registrarUsuario = async (datos: RegistroPayload) => {
    const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al registrarse');
    return data;
};

export const fetchCrisis = async (): Promise<Crisis[]> => {
    const res = await fetch(`${API_URL}/crisis`, { headers: getHeaders() });
    return (await res.json()) as Crisis[];
};

export const crearCrisis = async (datos: CrisisPayload) => {
    const res = await fetch(`${API_URL}/crisis`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await res.json();
};

// Medicamentos
export const apiListarMedicamentos = async (): Promise<Medicamento[]> => {
    const res = await fetch(`${API_URL}/medicamentos`, { headers: getHeaders() });
    return handleResponse<Medicamento[]>(res);
};

export const apiCrearMedicamento = async (payload: MedicamentoPayload) => {
    const res = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiActualizarMedicamento = async (id: number, payload: MedicamentoPayload) => {
    const res = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiEliminarMedicamento = async (id: number) => {
    const res = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse(res);
};

export const apiRegistrarToma = async (id: number) => {
    const res = await fetch(`${API_URL}/medicamentos/${id}/tomar`, {
        method: 'POST',
        headers: getHeaders()
    });
    return handleResponse(res);
};

export const apiListarTomas = async (desde: Date): Promise<RegistroToma[]> => {
    const res = await fetch(`${API_URL}/medicamentos/tomas?desde=${encodeURIComponent(desde.toISOString())}`, { headers: getHeaders() });
    return handleResponse<RegistroToma[]>(res);
};

// Contactos
export const apiListarContactos = async (): Promise<Contacto[]> => {
    const res = await fetch(`${API_URL}/contactos`, { headers: getHeaders() });
    return handleResponse<Contacto[]>(res);
};

export const apiCrearContacto = async (payload: ContactoPayload) => {
    const res = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiActualizarContacto = async (id: number, payload: ContactoPayload) => {
    const res = await fetch(`${API_URL}/contactos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiEliminarContacto = async (id: number) => {
    const res = await fetch(`${API_URL}/contactos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse(res);
};

// Plan de Seguridad
export const apiObtenerPlanSeguridad = async (): Promise<PlanSeguridad> => {
    const res = await fetch(`${API_URL}/plan-seguridad`, { headers: getHeaders() });
    return handleResponse<PlanSeguridad>(res);
};

export const apiGuardarPlanSeguridad = async (payload: PlanSeguridad) => {
    const res = await fetch(`${API_URL}/plan-seguridad`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

// Alias usados por el Dashboard
export const fetchMedicamentos = apiListarMedicamentos;
export const fetchContactos = apiListarContactos;
