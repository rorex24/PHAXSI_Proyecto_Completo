import React, { useEffect, useState } from 'react';
import { apiObtenerPlanSeguridad, apiGuardarPlanSeguridad } from '../services/api';

export default function PlanSeguridadPage() {
    const [plan, setPlan] = useState({
        pasos_crisis: '',
        cuando_llamar: '',
        desencadenantes: '',
        medico_nombre: '',
        medico_telefono: '',
        hospital_referencia: '',
        notas: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mensajeExito, setMensajeExito] = useState('');
    const [editMode, setEditMode] = useState(false);

    const cargarPlan = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiObtenerPlanSeguridad();
            setPlan({
                pasos_crisis: data.pasos_crisis || '',
                cuando_llamar: data.cuando_llamar || '',
                desencadenantes: data.desencadenantes || '',
                medico_nombre: data.medico_nombre || '',
                medico_telefono: data.medico_telefono || '',
                hospital_referencia: data.hospital_referencia || '',
                notas: data.notas || ''
            });
        } catch (err) {
            setError(err.message || 'Error al cargar el plan de seguridad');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPlan();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            await apiGuardarPlanSeguridad(plan);
            setMensajeExito('Plan de seguridad guardado exitosamente');
            setEditMode(false);
            setTimeout(() => setMensajeExito(''), 3000);
        } catch (err) {
            setError(err.message || 'Error al guardar el plan de seguridad');
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem' }}>Cargando plan de seguridad...</div>;
    }

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Plan de Seguridad en Epilepsia</h2>
                <button
                    onClick={() => setEditMode(!editMode)}
                    style={{ padding: '0.6rem 1.2rem', background: editMode ? '#64748b' : '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                    {editMode ? 'Cancelar edición' : 'Editar Plan'}
                </button>
            </div>

            {error && <div style={{ padding: '0.8rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', marginBottom: '1rem' }}>{error}</div>}
            {mensajeExito && <div style={{ padding: '0.8rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '1rem' }}>{mensajeExito}</div>}

            {editMode ? (
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Pasos durante una crisis (para el cuidador)</label>
                        <textarea
                            value={plan.pasos_crisis}
                            onChange={(e) => setPlan({ ...plan, pasos_crisis: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', height: '100px' }}
                            placeholder="1. Mantener la calma y cronometrar. 2. Proteger la cabeza..."
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>¿Cuándo llamar a emergencias?</label>
                        <textarea
                            value={plan.cuando_llamar}
                            onChange={(e) => setPlan({ ...plan, cuando_llamar: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px' }}
                            placeholder="Si la crisis dura más de 5 minutos, si hay dificultad respiratoria..."
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Desencadenantes conocidos</label>
                        <textarea
                            value={plan.desencadenantes}
                            onChange={(e) => setPlan({ ...plan, desencadenantes: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px' }}
                            placeholder="Falta de sueño, luces parpadeantes, estrés..."
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Médico Tratante</label>
                            <input
                                type="text"
                                value={plan.medico_nombre}
                                onChange={(e) => setPlan({ ...plan, medico_nombre: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                placeholder="Dr. Nombre Apellido"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Teléfono del Médico</label>
                            <input
                                type="tel"
                                value={plan.medico_telefono}
                                onChange={(e) => setPlan({ ...plan, medico_telefono: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                placeholder="+591 ..."
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Hospital de Referencia</label>
                        <input
                            type="text"
                            value={plan.hospital_referencia}
                            onChange={(e) => setPlan({ ...plan, hospital_referencia: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                            placeholder="Nombre del hospital o centro médico"
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 'bold' }}>Notas adicionales / Alergias</label>
                        <textarea
                            value={plan.notas}
                            onChange={(e) => setPlan({ ...plan, notas: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px' }}
                            placeholder="Alergias a medicamentos, notas especiales..."
                        />
                    </div>
                    <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Guardar Plan de Seguridad
                    </button>
                </form>
            ) : (
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gap: '1.2rem' }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.4rem 0', color: '#1e293b' }}>1. Pasos durante una crisis</h3>
                        <p style={{ margin: 0, color: '#475569', whiteSpace: 'pre-wrap' }}>{plan.pasos_crisis || 'No especificado.'}</p>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <div>
                        <h3 style={{ margin: '0 0 0.4rem 0', color: '#1e293b' }}>2. ¿Cuándo llamar a emergencias?</h3>
                        <p style={{ margin: 0, color: '#475569', whiteSpace: 'pre-wrap' }}>{plan.cuando_llamar || 'No especificado.'}</p>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <div>
                        <h3 style={{ margin: '0 0 0.4rem 0', color: '#1e293b' }}>3. Desencadenantes conocidos</h3>
                        <p style={{ margin: 0, color: '#475569', whiteSpace: 'pre-wrap' }}>{plan.desencadenantes || 'No especificado.'}</p>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#1e293b' }}>Médico Tratante</h4>
                            <p style={{ margin: 0, color: '#475569' }}>{plan.medico_nombre || 'No especificado'}</p>
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 0.2rem 0', color: '#1e293b' }}>Teléfono Médico</h4>
                            <p style={{ margin: 0, color: '#475569' }}>
                                {plan.medico_telefono ? <a href={`tel:${plan.medico_telefono}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{plan.medico_telefono}</a> : 'No especificado'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 0.2rem 0', color: '#1e293b' }}>Hospital de Referencia</h4>
                        <p style={{ margin: 0, color: '#475569' }}>{plan.hospital_referencia || 'No especificado'}</p>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <div>
                        <h3 style={{ margin: '0 0 0.4rem 0', color: '#1e293b' }}>Notas / Alergias</h3>
                        <p style={{ margin: 0, color: '#475569', whiteSpace: 'pre-wrap' }}>{plan.notas || 'Sin notas adicionales.'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}