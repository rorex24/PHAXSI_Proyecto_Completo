import React, { useEffect, useState } from 'react';
import {
    apiListarMedicamentos,
    apiCrearMedicamento,
    apiActualizarMedicamento,
    apiEliminarMedicamento,
    apiRegistrarToma
} from '../services/api';

export default function MedicamentosPage() {
    const [medicamentos, setMedicamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ nombre: '', dosis: '', frecuencia: '', horarios: '', indicaciones: '' });

    const cargarMedicamentos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiListarMedicamentos();
            setMedicamentos(data);
        } catch (err) {
            setError(err.message || 'Error al cargar medicamentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarMedicamentos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim()) {
            setError('El nombre del medicamento es obligatorio');
            return;
        }
        try {
            setError(null);
            if (editId) {
                await apiActualizarMedicamento(editId, form);
                setMensajeExito('Medicamento actualizado correctamente');
            } else {
                await apiCrearMedicamento(form);
                setMensajeExito('Medicamento añadido correctamente');
            }
            setForm({ nombre: '', dosis: '', frecuencia: '', horarios: '', indicaciones: '' });
            setShowForm(false);
            setEditId(null);
            cargarMedicamentos();
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            setError(err.message || 'Error al guardar el medicamento');
        }
    };

    const handleEditar = (med) => {
        setForm({
            nombre: med.nombre || '',
            dosis: med.dosis || '',
            frecuencia: med.frecuencia || '',
            horarios: med.horarios || '',
            indicaciones: med.indicaciones || ''
        });
        setEditId(med.id);
        setShowForm(true);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este medicamento?')) return;
        try {
            setError(null);
            await apiEliminarMedicamento(id);
            setMensajeExito('Medicamento eliminado');
            cargarMedicamentos();
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            setError(err.message || 'Error al eliminar');
        }
    };

    const handleTomar = async (id) => {
        try {
            setError(null);
            await apiRegistrarToma(id);
            setMensajeExito('¡Toma registrada con éxito!');
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            setError(err.message || 'Error al registrar toma');
        }
    };

    if (loading && medicamentos.length === 0) {
        return <div style={{ padding: '2rem' }}>Cargando medicamentos...</div>;
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Mis Medicamentos</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setForm({ nombre: '', dosis: '', frecuencia: '', horarios: '', indicaciones: '' });
                    }}
                    style={{ padding: '0.6rem 1.2rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    {showForm ? 'Cancelar' : '+ Añadir medicamento'}
                </button>
            </div>

            {error && <div style={{ padding: '0.8rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '0.8rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '1rem' }}>{mensajeExito}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <h3>{editId ? 'Editar Medicamento' : 'Nuevo Medicamento'}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Nombre (*)</label>
                        <input
                            type="text"
                            value={form.nombre}
                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. Carbamazepina"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Dosis</label>
                        <input
                            type="text"
                            value={form.dosis}
                            onChange={(e) => setForm({ ...form, dosis: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. 200mg"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Frecuencia</label>
                        <input
                            type="text"
                            value={form.frecuencia}
                            onChange={(e) => setForm({ ...form, frecuencia: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. Cada 8 horas"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Horarios</label>
                        <input
                            type="text"
                            value={form.horarios}
                            onChange={(e) => setForm({ ...form, horarios: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Ej. 08:00, 16:00, 00:00"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Indicaciones</label>
                        <textarea
                            value={form.indicaciones}
                            onChange={(e) => setForm({ ...form, indicaciones: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px' }}
                            placeholder="Ej. Tomar con alimentos"
                        />
                    </div>
                    <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        {editId ? 'Guardar Cambios' : 'Registrar Medicamento'}
                    </button>
                </form>
            )}

            {medicamentos.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>Aún no has agregado medicamentos.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {medicamentos.map((med) => (
                        <div key={med.id} style={{ background: '#fff', padding: '1.2rem', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{med.nombre}</h4>
                            <p style={{ margin: '0.2rem 0', color: '#475569' }}><strong>Dosis:</strong> {med.dosis || 'No especificada'}</p>
                            <p style={{ margin: '0.2rem 0', color: '#475569' }}><strong>Frecuencia:</strong> {med.frecuencia || 'No especificada'}</p>
                            <p style={{ margin: '0.2rem 0', color: '#475569' }}><strong>Horarios:</strong> {med.horarios || 'No especificados'}</p>
                            {med.indicaciones && <p style={{ margin: '0.2rem 0', color: '#475569' }}><strong>Indicaciones:</strong> {med.indicaciones}</p>}
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button onClick={() => handleTomar(med.id)} style={{ padding: '0.4rem 0.8rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    ✓ Marcar como tomado
                                </button>
                                <button onClick={() => handleEditar(med)} style={{ padding: '0.4rem 0.8rem', background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(med.id)} style={{ padding: '0.4rem 0.8rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }}>
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