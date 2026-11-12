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

// Medicamentos
export const apiListarMedicamentos = async () => {
    const res = await fetch(`${API_URL}/medicamentos`, { headers: getHeaders() });
    return handleResponse(res);
};

export const apiCrearMedicamento = async (payload) => {
    const res = await fetch(`${API_URL}/medicamentos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiActualizarMedicamento = async (id, payload) => {
    const res = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiEliminarMedicamento = async (id) => {
    const res = await fetch(`${API_URL}/medicamentos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse(res);
};

export const apiRegistrarToma = async (id) => {
    const res = await fetch(`${API_URL}/medicamentos/${id}/tomar`, {
        method: 'POST',
        headers: getHeaders()
    });
    return handleResponse(res);
};

// Contactos
export const apiListarContactos = async () => {
    const res = await fetch(`${API_URL}/contactos`, { headers: getHeaders() });
    return handleResponse(res);
};

export const apiCrearContacto = async (payload) => {
    const res = await fetch(`${API_URL}/contactos`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiActualizarContacto = async (id, payload) => {
    const res = await fetch(`${API_URL}/contactos/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};

export const apiEliminarContacto = async (id) => {
    const res = await fetch(`${API_URL}/contactos/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return handleResponse(res);
};

// Plan de Seguridad
export const apiObtenerPlanSeguridad = async () => {
    const res = await fetch(`${API_URL}/plan-seguridad`, { headers: getHeaders() });
    return handleResponse(res);
};

export const apiGuardarPlanSeguridad = async (payload) => {
    const res = await fetch(`${API_URL}/plan-seguridad`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
};
