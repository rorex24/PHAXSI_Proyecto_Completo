const API_URL = 'http://192.168.1.157:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const loginUsuario = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error en inicio de sesión');
    return data;
};

export const registrarUsuario = async (datos) => {
    const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al registrarse');
    return data;
};

export const fetchCrisis = async () => {
    const res = await fetch(`${API_URL}/crisis`, { headers: getHeaders() });
    return await res.json();
};

export const crearCrisis = async (datos) => {
    const res = await fetch(`${API_URL}/crisis`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await res.json();
};

export const fetchMedicamentos = async () => {
    const res = await fetch(`${API_URL}/medicamentos`, { headers: getHeaders() });
    return await res.json();
};

export const crearMedicamento = async (datos) => {
    const res = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await res.json();
};

export const fetchContactos = async () => {
    const res = await fetch(`${API_URL}/contactos`, { headers: getHeaders() });
    return await res.json();
};

export const crearContacto = async (datos) => {
    const res = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(datos)
    });
    return await res.json();
};
