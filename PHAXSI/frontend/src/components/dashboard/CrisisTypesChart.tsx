import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart } from 'lucide-react';
import type { Crisis } from '../../types';
import { distribucionTipos } from '../../utils/crisisCharts';

interface Props {
    crisis: Crisis[] | null;
    cargando: boolean;
    error: string | null;
}

const RADIO = 60;
const GROSOR = 24;
const CIRC = 2 * Math.PI * RADIO;

export const CrisisTypesChart = ({ crisis, cargando, error }: Props) => {
    const tipos = useMemo(() => distribucionTipos(crisis ?? []), [crisis]);
    const total = crisis?.length ?? 0;

    let acumulado = 0;
    const segmentos = tipos.map(t => {
        const largo = (t.cantidad / total) * CIRC;
        const seg = { ...t, largo, desfase: -acumulado };
        acumulado += largo;
        return seg;
    });

    const resumen = tipos.map(t => `${t.nombre}: ${t.porcentaje}% (${t.cantidad})`).join('; ');

    return (
        <section className="chart-card" aria-labelledby="tipos-titulo">
            <h2 id="tipos-titulo" className="chart-title">
                <PieChart size={22} aria-hidden="true" /> Tipos de crisis
            </h2>

            {cargando ? (
                <p role="status" className="chart-state">Cargando...</p>
            ) : error ? (
                <p role="alert" className="chart-state chart-state-error">No se pudo cargar los tipos de crisis.</p>
            ) : total === 0 ? (
                <div className="chart-state">
                    <p>Aún no has registrado crisis.</p>
                    <Link to="/crisis" className="chart-action">Registrar mi primera crisis</Link>
                </div>
            ) : (
                <div className="donut-wrap">
                    <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label={`Distribución por tipo de crisis. ${resumen}`}>
                        <g transform="rotate(-90 80 80)">
                            <circle cx="80" cy="80" r={RADIO} fill="none" stroke="#EDE9FE" strokeWidth={GROSOR} />
                            {segmentos.map(s => (
                                <circle
                                    key={s.nombre}
                                    cx="80"
                                    cy="80"
                                    r={RADIO}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={GROSOR}
                                    strokeDasharray={`${s.largo} ${CIRC - s.largo}`}
                                    strokeDashoffset={s.desfase}
                                />
                            ))}
                        </g>
                        <text x="80" y="82" textAnchor="middle" fontSize="30" fontWeight="700" fill="#2E1065">{total}</text>
                        <text x="80" y="102" textAnchor="middle" fontSize="13" fill="#5B5675">Total</text>
                    </svg>

                    <ul className="donut-legend">
                        {tipos.map(t => (
                            <li key={t.nombre}>
                                <span className="legend-swatch" style={{ background: t.color }} aria-hidden="true" />
                                <span className="legend-name">{t.nombre}</span>
                                <span className="legend-value">{t.porcentaje}% · {t.cantidad}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};
