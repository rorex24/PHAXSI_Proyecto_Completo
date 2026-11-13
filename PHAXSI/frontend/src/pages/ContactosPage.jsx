import React, { useEffect, useState } from 'react';
import {
    apiListarContactos,
    apiCrearContacto,
    apiActualizarContacto,
    apiEliminarContacto
} from '../services/api';

export default function ContactosPage() {
    const [contactos, setContactos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ nombre: '', parentesco: '', telefono: '', es_principal: false });

    const cargarContactos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiListarContactos();
            setContactos(data);
        } catch (err) {
            setError(err.message || 'Error al cargar contactos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarContactos();
    }, []);

    const validarTelefono = (tel) => {
        const regex = /^\+?[0-9\s\-]{7,15}$/;
        return regex.test(tel);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || !form.telefono.trim()) {
            setError('El nombre y el teléfono son obligatorios');
            return;
        }
        if (!validarTelefono(form.telefono)) {
            setError('Formato de teléfono inválido (ej. +591 70000000)');
            return;
        }

        try {
            setError(null);
            if (editId) {
                await apiActualizarContacto(editId, form);
                setMensajeExito('Contacto actualizado correctamente');
            } else {
                await apiCrearContacto(form);
                setMensajeExito('Contacto añadido correctamente');
            }
            setForm({ nombre: '', parentesco: '', telefono: '', es_principal: false });
            setShowForm(false);
            setEditId(null);
            cargarContactos();
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            setError(err.message || 'Error al guardar el contacto');
        }
    };

    const handleEditar = (con) => {
        setForm({
            nombre: con.nombre || '',
            parentesco: con.parentesco || '',
            telefono: con.telefono || '',
            es_principal: con.es_principal === 1 || con.es_principal === true
        });
        setEditId(con.id);
        setShowForm(true);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este contacto?')) return;
        try {
            setError(null);
            await apiEliminarContacto(id);
            setMensajeExito('Contacto eliminado');
            cargarContactos();
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            setError(err.message || 'Error al eliminar');
        }
    };

    if (loading && contactos.length === 0) {
        return <div style={{ padding: '2rem' }}>Cargando contactos...</div>;
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Contactos de Emergencia</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setForm({ nombre: '', parentesco: '', telefono: '', es_principal: false });
                    }}
                    style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    {showForm ? 'Cancelar' : '+ Añadir contacto'}
                </button>
            </div>

            {error && <div style={{ padding: '0.8rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '0.8rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '1rem' }}>{mensajeExito}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h3>{editId ? 'Editar Contacto' : 'Nuevo Contacto de Emergencia'}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Nombre (*)</label>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. Dr. Juan Pérez / Mamá"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Parentesco / Relación</label>
                        <input
                            type="text"
                            value={form.parentesco}
                            onChange={(e) => setForm({ ...form, parentesco: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. Madre, Neurólogo, Familiar"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Teléfono (*)</label>
                        <input
                            type="tel"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. +591 70000000"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="checkbox"
                            id="es_principal"
                            checked={form.es_principal}
                            onChange={(e) => setForm({ ...form, es_principal: e.target.checked })}
                        />
                        <label htmlFor="es_principal" style={{ fontWeight: 'bold', cursor: 'pointer' }}>Marcar como contacto principal</label>
                    </div>
                    <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        {editId ? 'Guardar Cambios' : 'Guardar Contacto'}
                    </button>
                </form>
            )}

            {contactos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Aún no hay contactos de emergencia registrados.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {contactos.map((con) => (
                        <div key={con.id} style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.3rem 0', color: '#1e293b' }}>
                                    {con.nombre} {con.es_principal ? <span style={{ background: '#fef08a', color: '#854d0e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>Principal</span> : null}
                                </h4>
                                <p style={{ margin: '0.2rem 0', color: '#475569' }}><strong>Relación:</strong> {con.parentesco || 'No especificada'}</p>
                                <p style={{ margin: '0.2rem 0', color: '#475569' }}>
                                    <strong>Teléfono:</strong> <a href={`tel:${con.telefono}`} style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>{con.telefono}</a>
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a href={`tel:${con.telefono}`} style={{ padding: '0.4rem 0.8rem', background: '#16a34a', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                                    📞 Llamar
                                </a>
                                <button onClick={() => handleEditar(con)} style={{ padding: '0.4rem 0.8rem', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(con.id)} style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}