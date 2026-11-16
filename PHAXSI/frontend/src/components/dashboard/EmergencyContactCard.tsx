import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, UserPlus } from 'lucide-react';
import type { Contacto } from '../../types';

interface Props {
    contactos: Contacto[] | null;
    cargando: boolean;
    error: string | null;
}

// Deja solo dígitos y un "+" inicial, válido para un enlace tel:
const telefonoLimpio = (t: string): string => {
    const t2 = t.trim();
    return (t2.startsWith('+') ? '+' : '') + t2.replace(/\D/g, '');
};

export const EmergencyContactCard = ({ contactos, cargando, error }: Props) => {
    const lista = contactos ?? [];
    const marcado = lista.find(c => Boolean(Number(c.es_principal)));
    const principal = marcado ?? lista[0];
    const tel = principal ? telefonoLimpio(principal.telefono || '') : '';

    return (
        <section className="emergency-card" aria-labelledby="contacto-titulo">
            <h2 id="contacto-titulo" className="emergency-title">Contacto de emergencia</h2>

            {cargando ? (
                <p role="status">Cargando...</p>
            ) : error ? (
                <p role="alert">No se pudieron cargar tus contactos.</p>
            ) : !principal ? (
                <>
                    <p>Aún no tienes contactos de emergencia. Agrega a alguien de confianza.</p>
                    <Link to="/contactos" className="emergency-btn">
                        <UserPlus size={22} aria-hidden="true" /> Agregar contacto
                    </Link>
                </>
            ) : (
                <>
                    <p className="emergency-name">
                        {principal.nombre}
                        {principal.parentesco ? ` (${principal.parentesco})` : ''}
                    </p>
                    <p className="emergency-meta">
                        {marcado ? 'Contacto principal' : 'Primer contacto de tu lista (aún no marcas uno principal)'}
                    </p>
                    {tel ? (
                        <a href={`tel:${tel}`} className="emergency-btn" aria-label={`Llamar a ${principal.nombre}`}>
                            <Phone size={22} aria-hidden="true" /> Llamar
                        </a>
                    ) : (
                        <p role="alert">Este contacto no tiene un teléfono válido.</p>
                    )}
                </>
            )}

            {!cargando && !error && (
                <Link to="/contactos" className="emergency-link">
                    {lista.length === 1 ? '1 contacto' : `${lista.length} contactos`} · Ver contactos →
                </Link>
            )}
        </section>
    );
};
