import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Pill } from 'lucide-react';
import type { Medicamento, RegistroToma } from '../../types';
import { estaActivo, proximaToma } from '../../utils/medicacion';
import { formatoHora } from '../../utils/horarios';

interface Props {
    medicamentos: Medicamento[] | null;
    tomas: RegistroToma[] | null;
    cargando: boolean;
    error: string | null;
    /** Registra la toma en el backend y refresca los datos. Solo se llama al pulsar el botón. */
    onMarcar: (medicamentoId: number) => Promise<void>;
}

export const NextMedicationCard = ({ medicamentos, tomas, cargando, error, onMarcar }: Props) => {
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [errorAccion, setErrorAccion] = useState<string | null>(null);
    const enCurso = useRef(false);

    const activos = useMemo(() => (medicamentos ?? []).filter(estaActivo), [medicamentos]);
    const proxima = useMemo(
        () => (medicamentos && tomas ? proximaToma(medicamentos, tomas) : null),
        [medicamentos, tomas]
    );

    const marcar = async () => {
        if (!proxima || enCurso.current) return;
        enCurso.current = true;
        setGuardando(true);
        setMensaje(null);
        setErrorAccion(null);
        const nombre = proxima.medicamento.nombre;
        try {
            await onMarcar(proxima.medicamento.id);
            setMensaje(`Toma de ${nombre} registrada.`);
        } catch (e) {
            setErrorAccion(e instanceof Error ? e.message : 'No se pudo registrar la toma.');
        } finally {
            enCurso.current = false;
            setGuardando(false);
        }
    };

    return (
        <section className="med-card" aria-labelledby="med-titulo">
            <h2 id="med-titulo" className="chart-title">
                <Pill size={22} aria-hidden="true" /> Próxima toma de medicamento
            </h2>

            {cargando ? (
                <p role="status" className="chart-state">Cargando...</p>
            ) : error ? (
                <p role="alert" className="chart-state chart-state-error">No se pudieron cargar tus medicamentos.</p>
            ) : activos.length === 0 ? (
                <div className="chart-state">
                    <p>Aún no tienes medicamentos registrados.</p>
                    <Link to="/medicamentos" className="chart-action">Agregar medicamento</Link>
                </div>
            ) : !proxima ? (
                <div className="med-done">
                    <Check size={24} aria-hidden="true" />
                    <p>Ya registraste todas tus tomas de hoy.</p>
                </div>
            ) : (
                <>
                    <p className="med-name">
                        {proxima.medicamento.nombre}
                        {proxima.medicamento.dosis ? ` (${proxima.medicamento.dosis})` : ''}
                    </p>
                    <p className="med-time">
                        <Clock size={18} aria-hidden="true" />
                        {proxima.minutos !== null ? (
                            <span>
                                Hoy · {formatoHora(proxima.minutos)}
                                {proxima.atrasada ? ' · Atrasada' : ''}
                            </span>
                        ) : (
                            <span>Horario: {proxima.medicamento.horarios?.trim() || 'sin indicar'}</span>
                        )}
                    </p>
                    <button type="button" className="med-btn" onClick={marcar} disabled={guardando}>
                        <Check size={22} aria-hidden="true" />
                        {guardando ? 'Guardando...' : 'Marcar como tomada'}
                    </button>
                </>
            )}

            <div aria-live="polite">
                {mensaje && <p className="med-feedback">{mensaje}</p>}
            </div>
            {errorAccion && <p role="alert" className="med-feedback-error">{errorAccion}</p>}
        </section>
    );
};
