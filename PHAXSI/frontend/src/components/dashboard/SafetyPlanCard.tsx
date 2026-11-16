import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import type { PlanSeguridad } from '../../types';

interface Props {
    plan: PlanSeguridad | null;
    cargando: boolean;
    error: string | null;
}

const CAMPOS: (keyof PlanSeguridad)[] = ['pasos_crisis', 'cuando_llamar', 'desencadenantes', 'medico_nombre', 'medico_telefono', 'hospital_referencia'];

export const SafetyPlanCard = ({ plan, cargando, error }: Props) => {
    const completados = plan ? CAMPOS.filter(c => String(plan[c] ?? '').trim() !== '').length : 0;
    const vacio = completados === 0;
    const completo = completados === CAMPOS.length;

    return (
        <section className="safety-card" aria-labelledby="plan-titulo">
            <div className="safety-icon" aria-hidden="true">
                {vacio || error ? <ShieldAlert size={44} /> : <ShieldCheck size={44} />}
            </div>
            <div className="safety-body">
                <h2 id="plan-titulo" className="safety-title">
                    {cargando ? 'Tu plan de seguridad' : error ? 'Tu plan de seguridad' : vacio ? 'Aún no tienes un plan de seguridad' : completo ? 'Tu plan de seguridad está completo' : 'Tu plan de seguridad está en progreso'}
                </h2>

                {cargando ? (
                    <p role="status">Cargando...</p>
                ) : error ? (
                    <p role="alert">No se pudo cargar tu plan de seguridad.</p>
                ) : vacio ? (
                    <p>Define qué hacer durante una crisis y a quién llamar. Te tomará pocos minutos.</p>
                ) : (
                    <>
                        <p>{completados} de {CAMPOS.length} secciones completadas.</p>
                        {plan?.medico_nombre?.trim() && (
                            <p className="safety-detail">
                                <strong>Médico:</strong> {plan.medico_nombre}
                                {plan.medico_telefono?.trim() ? ` · ${plan.medico_telefono}` : ''}
                            </p>
                        )}
                        {plan?.hospital_referencia?.trim() && (
                            <p className="safety-detail"><strong>Hospital de referencia:</strong> {plan.hospital_referencia}</p>
                        )}
                    </>
                )}

                <Link to="/plan-seguridad" className="safety-link">
                    {vacio && !cargando && !error ? 'Crear mi plan de seguridad' : 'Ver mi plan y perfil médico'} →
                </Link>
            </div>
        </section>
    );
};
