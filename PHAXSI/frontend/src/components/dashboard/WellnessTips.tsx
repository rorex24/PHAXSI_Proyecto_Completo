import React from 'react';
import { Check, Lightbulb } from 'lucide-react';

const CONSEJOS = [
    'Mantén un horario regular de sueño.',
    'Evita el estrés en exceso.',
    'Toma tu medicación puntualmente.',
    'Consulta a tu médico ante cambios.'
];

export const WellnessTips = () => {
    return (
        <section className="tips-card" aria-labelledby="consejos-titulo">
            <h2 id="consejos-titulo" className="chart-title">
                <Lightbulb size={22} aria-hidden="true" /> Consejos para tu bienestar
            </h2>
            <ul className="tips-list">
                {CONSEJOS.map(c => (
                    <li key={c}>
                        <span className="tips-check" aria-hidden="true"><Check size={16} /></span>
                        {c}
                    </li>
                ))}
            </ul>
            <p className="tips-note">Información general y educativa. No reemplaza la indicación de tu médico.</p>
        </section>
    );
};
