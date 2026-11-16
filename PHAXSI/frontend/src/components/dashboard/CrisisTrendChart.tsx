import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import type { Crisis } from '../../types';
import { crisisPorMes } from '../../utils/crisisCharts';

interface Props {
    crisis: Crisis[] | null;
    cargando: boolean;
    error: string | null;
}

const ALTO = 260;
const MARGEN = { izq: 36, der: 20, arr: 28, aba: 36 };

export const CrisisTrendChart = ({ crisis, cargando, error }: Props) => {
    const contRef = useRef<HTMLDivElement>(null);
    const [ancho, setAncho] = useState(520);

    // Se dibuja al ancho real del contenedor para que el texto no se encoja en móvil.
    useEffect(() => {
        const el = contRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const obs = new ResizeObserver(entries => {
            const w = Math.floor(entries[0].contentRect.width);
            if (w > 0) setAncho(w);
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, [cargando, error, crisis]);

    const puntos = useMemo(() => crisisPorMes(crisis ?? []), [crisis]);
    const max = Math.max(...puntos.map(p => p.total), 0);
    const paso = Math.max(1, Math.ceil(max / 4));
    const yMax = Math.max(paso * 4, 4);
    const ticks = [0, 1, 2, 3, 4].map(i => i * paso);

    const anchoUtil = Math.max(ancho - MARGEN.izq - MARGEN.der, 100);
    const altoUtil = ALTO - MARGEN.arr - MARGEN.aba;
    const x = (i: number) => MARGEN.izq + (anchoUtil / (puntos.length - 1)) * i;
    const y = (v: number) => MARGEN.arr + altoUtil - (v / yMax) * altoUtil;

    const linea = puntos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.total)}`).join(' ');
    const area = `${linea} L${x(puntos.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
    const resumen = puntos.map(p => `${p.etiquetaLarga}: ${p.total}`).join('; ');
    const sinRegistros = !!crisis && crisis.length === 0;

    return (
        <section className="chart-card" aria-labelledby="tendencia-titulo">
            <h2 id="tendencia-titulo" className="chart-title">
                <BarChart3 size={22} aria-hidden="true" /> Seguimiento de crisis
            </h2>
            <p className="chart-subtitle">Eventos registrados en los últimos 6 meses</p>

            {cargando ? (
                <p role="status" className="chart-state">Cargando...</p>
            ) : error ? (
                <p role="alert" className="chart-state chart-state-error">No se pudo cargar el seguimiento de crisis.</p>
            ) : sinRegistros ? (
                <div className="chart-state">
                    <p>Aún no has registrado crisis.</p>
                    <Link to="/crisis" className="chart-action">Registrar mi primera crisis</Link>
                </div>
            ) : (
                <div ref={contRef} className="chart-box">
                    <svg width={ancho} height={ALTO} role="img" aria-label={`Crisis por mes. ${resumen}`}>
                        {ticks.map(t => (
                            <g key={t}>
                                <line x1={MARGEN.izq} x2={MARGEN.izq + anchoUtil} y1={y(t)} y2={y(t)} stroke="#DDD6FE" strokeWidth="1" />
                                <text x={MARGEN.izq - 8} y={y(t) + 4} textAnchor="end" fontSize="13" fill="#5B5675">{t}</text>
                            </g>
                        ))}
                        <path d={area} fill="#EDE9FE" opacity="0.8" />
                        <path d={linea} fill="none" stroke="#6D28D9" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                        {puntos.map((p, i) => (
                            <g key={p.etiquetaLarga}>
                                <circle cx={x(i)} cy={y(p.total)} r="5" fill="#fff" stroke="#6D28D9" strokeWidth="3" />
                                <text x={x(i)} y={y(p.total) - 12} textAnchor="middle" fontSize="14" fontWeight="700" fill="#2E1065">{p.total}</text>
                                <text x={x(i)} y={ALTO - 10} textAnchor="middle" fontSize="13" fill="#5B5675">{p.etiqueta}</text>
                            </g>
                        ))}
                    </svg>
                </div>
            )}
        </section>
    );
};
