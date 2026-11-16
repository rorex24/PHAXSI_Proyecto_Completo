import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, UserCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { apiGuardarPerfil, apiObtenerPerfil } from '../services/api';
import type { Perfil as PerfilData, PerfilPayload } from '../types';

const TIPOS_SANGRE = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const aFormulario = (p: PerfilData): PerfilPayload => ({
    nombre: p.nombre || '',
    telefono: p.telefono || '',
    fecha_nacimiento: p.fecha_nacimiento || '',
    tipo_sangre: p.tipo_sangre || '',
    condiciones_adicionales: p.condiciones_adicionales || '',
    alergias: p.alergias || '',
    contacto_medico: p.contacto_medico || ''
});

const ROLES: Record<string, string> = { paciente: 'Paciente', cuidador: 'Cuidador', admin: 'Administrador' };

export const Perfil = () => {
    const { usuario, actualizarUsuario } = useContext(AuthContext);
    const [perfil, setPerfil] = useState<PerfilData | null>(null);
    const [form, setForm] = useState<PerfilPayload | null>(null);
    const [cargando, setCargando] = useState(true);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);
    const [guardando, setGuardando] = useState(false);
    const [errorGuardar, setErrorGuardar] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;
        apiObtenerPerfil()
            .then(p => {
                if (cancelado) return;
                setPerfil(p);
                setForm(aFormulario(p));
            })
            .catch((e: unknown) => {
                if (!cancelado) setErrorCarga(e instanceof Error ? e.message : 'No se pudo cargar el perfil');
            })
            .finally(() => {
                if (!cancelado) setCargando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    const cambiar = (campo: keyof PerfilPayload, valor: string) => {
        setForm(prev => (prev ? { ...prev, [campo]: valor } : prev));
        setExito(null);
    };

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form || guardando) return;
        if (!form.nombre.trim()) {
            setErrorGuardar('El nombre es obligatorio');
            return;
        }
        setGuardando(true);
        setErrorGuardar(null);
        setExito(null);
        try {
            const res = await apiGuardarPerfil(form);
            setPerfil(res.perfil);
            setForm(aFormulario(res.perfil));
            actualizarUsuario({ nombre: res.perfil.nombre });
            setExito('Tus datos se guardaron correctamente.');
        } catch (err) {
            setErrorGuardar(err instanceof Error ? err.message : 'No se pudo guardar el perfil');
        } finally {
            setGuardando(false);
        }
    };

    const nombreMostrado = perfil?.nombre || usuario?.nombre || '';
    const inicial = nombreMostrado.trim().charAt(0).toUpperCase() || '?';
    const miembroDesde = perfil?.creado_en ? new Date(perfil.creado_en) : null;

    return (
        <div className="perfil-page">
            <h1 className="perfil-title">Mi perfil</h1>

            <section className="perfil-head" aria-label="Resumen de la cuenta">
                <div className="perfil-avatar" aria-hidden="true">{inicial}</div>
                <div>
                    <p className="perfil-name">{nombreMostrado || 'Usuario'}</p>
                    <p className="perfil-meta">{perfil?.email || usuario?.email}</p>
                    <p className="perfil-meta">
                        {perfil?.rol ? `${ROLES[perfil.rol] ?? perfil.rol}` : ''}
                        {perfil?.rol && miembroDesde && !isNaN(miembroDesde.getTime()) ? ' · ' : ''}
                        {miembroDesde && !isNaN(miembroDesde.getTime())
                            ? `Miembro desde ${miembroDesde.toLocaleDateString('es-BO', { month: 'long', year: 'numeric' })}`
                            : ''}
                    </p>
                </div>
                <Link to="/plan-seguridad" className="perfil-plan-link">
                    <ShieldCheck size={20} aria-hidden="true" /> Mi plan de seguridad
                </Link>
            </section>

            {cargando ? (
                <p role="status" className="perfil-state">Cargando...</p>
            ) : errorCarga || !form ? (
                <p role="alert" className="perfil-state perfil-error">
                    No se pudo cargar tu perfil. {errorCarga}
                </p>
            ) : (
                <form onSubmit={guardar} noValidate>
                    <section className="perfil-card" aria-labelledby="datos-personales">
                        <h2 id="datos-personales" className="perfil-section-title">
                            <UserCircle size={22} aria-hidden="true" /> Datos personales
                        </h2>
                        <div className="perfil-grid">
                            <div className="form-group">
                                <label htmlFor="pf-nombre">Nombre completo</label>
                                <input id="pf-nombre" className="form-control" value={form.nombre} maxLength={100} required
                                    onChange={e => cambiar('nombre', e.target.value)} autoComplete="name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pf-email">Correo electrónico</label>
                                <input id="pf-email" className="form-control" value={perfil?.email || ''} readOnly aria-describedby="pf-email-ayuda" />
                                <p id="pf-email-ayuda" className="perfil-help">El correo no se puede cambiar desde aquí.</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pf-telefono">Teléfono</label>
                                <input id="pf-telefono" type="tel" className="form-control" value={form.telefono} placeholder="+591 70000000"
                                    onChange={e => cambiar('telefono', e.target.value)} autoComplete="tel" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pf-nacimiento">Fecha de nacimiento</label>
                                <input id="pf-nacimiento" type="date" className="form-control" value={form.fecha_nacimiento}
                                    max={new Date().toISOString().slice(0, 10)}
                                    onChange={e => cambiar('fecha_nacimiento', e.target.value)} autoComplete="bday" />
                            </div>
                        </div>
                    </section>

                    <section className="perfil-card" aria-labelledby="perfil-medico">
                        <h2 id="perfil-medico" className="perfil-section-title">
                            <HeartPulse size={22} aria-hidden="true" /> Perfil médico
                        </h2>
                        <p className="perfil-help perfil-help-top">
                            Esta información es solo tuya. Mantenerla actualizada ayuda a quien te asista en una emergencia.
                        </p>
                        <div className="perfil-grid">
                            <div className="form-group">
                                <label htmlFor="pf-sangre">Tipo de sangre</label>
                                <select id="pf-sangre" className="form-control" value={form.tipo_sangre}
                                    onChange={e => cambiar('tipo_sangre', e.target.value)}>
                                    <option value="">No especificado</option>
                                    {TIPOS_SANGRE.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="pf-medico">Médico tratante / contacto médico</label>
                                <input id="pf-medico" className="form-control" value={form.contacto_medico} maxLength={2000}
                                    placeholder="Ej. Dra. Pérez, neuróloga · 70000000"
                                    onChange={e => cambiar('contacto_medico', e.target.value)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-alergias">Alergias</label>
                            <textarea id="pf-alergias" className="form-control" rows={3} value={form.alergias} maxLength={2000}
                                placeholder="Medicamentos, alimentos u otras alergias"
                                onChange={e => cambiar('alergias', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pf-condiciones">Condiciones adicionales</label>
                            <textarea id="pf-condiciones" className="form-control" rows={3} value={form.condiciones_adicionales} maxLength={2000}
                                placeholder="Otras condiciones de salud relevantes"
                                onChange={e => cambiar('condiciones_adicionales', e.target.value)} />
                        </div>
                    </section>

                    <div className="perfil-actions">
                        <button type="submit" className="btn btn-primary perfil-save" disabled={guardando}>
                            {guardando ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                        <div aria-live="polite">{exito && <p className="perfil-success">{exito}</p>}</div>
                        {errorGuardar && <p role="alert" className="perfil-error">{errorGuardar}</p>}
                    </div>
                </form>
            )}
        </div>
    );
};
