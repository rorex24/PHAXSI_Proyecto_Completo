import type { Medicamento, RegistroToma } from '../types';
import { parseHorarios } from './horarios';

export const estaActivo = (m: Medicamento): boolean => m.activo === undefined || m.activo === null || Boolean(Number(m.activo));

export interface ProximaToma {
    medicamento: Medicamento;
    /** Minutos desde medianoche; null si el texto de horarios no se pudo interpretar. */
    minutos: number | null;
    atrasada: boolean;
}

const tomasDe = (m: Medicamento, tomasHoy: RegistroToma[]): number =>
    tomasHoy.filter(t => t.medicamento_id === m.id && (t.tomado === undefined || Boolean(Number(t.tomado)))).length;

// Próxima toma pendiente de hoy. Las tomas ya registradas de un medicamento cuentan sobre sus primeros horarios del día.
// Un medicamento sin horario interpretable cuenta como 1 toma sin hora (va después de las que sí tienen hora).
export function proximaToma(meds: Medicamento[], tomasHoy: RegistroToma[], ahora: Date = new Date()): ProximaToma | null {
    const minAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const pendientes: { m: Medicamento; minutos: number | null }[] = [];

    for (const m of meds.filter(estaActivo)) {
        const horas = parseHorarios(m.horarios);
        const hechas = tomasDe(m, tomasHoy);
        if (horas.length === 0) {
            if (hechas < 1) pendientes.push({ m, minutos: null });
        } else {
            horas.slice(hechas).forEach(h => pendientes.push({ m, minutos: h }));
        }
    }

    if (pendientes.length === 0) return null;
    pendientes.sort((a, b) => {
        if (a.minutos === null && b.minutos === null) return 0;
        if (a.minutos === null) return 1;
        if (b.minutos === null) return -1;
        return a.minutos - b.minutos;
    });
    const p = pendientes[0];
    return { medicamento: p.m, minutos: p.minutos, atrasada: p.minutos !== null && p.minutos < minAhora };
}

export interface EstadoMedicacionHoy {
    programadas: number;
    tomadas: number;
    pendientes: number;
}

// Tomas del día: programadas = horarios interpretados por medicamento activo (mínimo 1 si el texto no se entiende).
// Las tomas de cada medicamento no pueden superar sus programadas, para que "tomadas" nunca exceda el total.
export function estadoMedicacionHoy(meds: Medicamento[], tomasHoy: RegistroToma[]): EstadoMedicacionHoy {
    let programadas = 0;
    let tomadas = 0;
    for (const m of meds.filter(estaActivo)) {
        const prog = Math.max(1, parseHorarios(m.horarios).length);
        const hechas = tomasHoy.filter(t => t.medicamento_id === m.id && (t.tomado === undefined || Boolean(Number(t.tomado)))).length;
        programadas += prog;
        tomadas += Math.min(prog, hechas);
    }
    return { programadas, tomadas, pendientes: programadas - tomadas };
}
