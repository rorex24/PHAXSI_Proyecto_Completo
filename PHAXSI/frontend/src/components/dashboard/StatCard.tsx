import React, { type ReactNode } from 'react';

interface Props {
    icon: ReactNode;
    titulo: string;
    cargando: boolean;
    error: string | null;
    valor: string;
    detalle?: string;
    variante?: 'morado' | 'verde';
}

export const StatCard = ({ icon, titulo, cargando, error, valor, detalle, variante = 'morado' }: Props) => {
    return (
        <section className="stat-card" aria-label={titulo}>
            <div className={`stat-icon${variante === 'verde' ? ' stat-icon-green' : ''}`} aria-hidden="true">{icon}</div>
            <div className="stat-body">
                <h2 className="stat-title">{titulo}</h2>
                {cargando ? (
                    <p className="stat-muted" role="status">Cargando...</p>
                ) : error ? (
                    <p className="stat-error" role="alert">No se pudo cargar</p>
                ) : (
                    <>
                        <p className="stat-value">{valor}</p>
                        {detalle && <p className="stat-detail">{detalle}</p>}
                    </>
                )}
            </div>
        </section>
    );
};
