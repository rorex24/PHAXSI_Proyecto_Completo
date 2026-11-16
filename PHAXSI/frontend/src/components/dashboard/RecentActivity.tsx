import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, ListChecks } from 'lucide-react';
import type { Crisis } from '../../types';

interface Props {
    crisis: Crisis[] | null;
    cargando: boolean;
    error: string | null;
}

const MAXIMO = 5;

export const RecentActivity = ({ crisis, cargando, error }: Props) => {
    const recientes = useMemo(
        () =>
            [...(crisis ?? [])]
                .filter(c => !isNaN(new Date(c.fecha_hora).getTime()))
                .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())
                .slice(0, MAXIMO),
        [crisis]
    );

    return (
        <section className="chart-card" aria-labelledby="actividad-titulo">
            <div className="activity-head">
                <h2 id="actividad-titulo" className="chart-title">
                    <ListChecks size={22} aria-hidden="true" /> Actividad reciente
                </h2>
                <Link to="/crisis#historial" className="activity-all">Ver historial →</Link>
            </div>

            {cargando ? (
                <p role="status" className="chart-state">Cargando...</p>
            ) : error ? (
                <p role="alert" className="chart-state chart-state-error">No se pudo cargar la actividad reciente.</p>
            ) : recientes.length === 0 ? (
                <div className="chart-state">
                    <p>Aún no has registrado crisis.</p>
                    <Link to="/crisis" className="chart-action">Registrar mi primera crisis</Link>
                </div>
            ) : (
                <ul className="activity-list">
                    {recientes.map(c => {
                        const f = new Date(c.fecha_hora);
                        const sintomas = c.sintomas?.trim();
                        return (
                            <li key={c.id} className="activity-item">
                                <span className="activity-icon" aria-hidden="true"><Activity size={18} /></span>
                                <div className="activity-main">
                                    <p className="activity-type">{c.tipo_crisis}</p>
                                    <p className="activity-meta">
                                        {f.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' })} ·{' '}
                                        {f.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <p className="activity-duration">
                                    <Clock size={16} aria-hidden="true" />
                                    <span>{Number(c.duracion_minutos)} min</span>
                                </p>
                                <p className="activity-symptoms">{sintomas || 'Sin síntomas registrados'}</p>
                                <Link to="/crisis#historial" className="activity-details" aria-label={`Ver detalles de la crisis del ${f.toLocaleDateString('es-BO')}`}>
                                    Detalles
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};
