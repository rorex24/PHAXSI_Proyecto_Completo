import type { Crisis } from '../types';

const aFecha = (c: Crisis): Date => new Date(c.fecha_hora);

export interface ResumenCrisis {
    totalMes: number;
    totalMesAnterior: number;
    ultima: Crisis | null;
    diasDesdeUltima: number | null;
    duracionPromedio: number | null;
}

export function resumenCrisis(lista: Crisis[], ahora: Date = new Date()): ResumenCrisis {
    const validas = lista.filter(c => !isNaN(aFecha(c).getTime()));
    const mes = ahora.getMonth();
    const anio = ahora.getFullYear();
    const mesAnt = mes === 0 ? 11 : mes - 1;
    const anioAnt = mes === 0 ? anio - 1 : anio;

    const totalMes = validas.filter(c => aFecha(c).getMonth() === mes && aFecha(c).getFullYear() === anio).length;
    const totalMesAnterior = validas.filter(c => aFecha(c).getMonth() === mesAnt && aFecha(c).getFullYear() === anioAnt).length;

    let ultima: Crisis | null = null;
    for (const c of validas) {
        if (!ultima || aFecha(c) > aFecha(ultima)) ultima = c;
    }

    let diasDesdeUltima: number | null = null;
    if (ultima) {
        const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()).getTime();
        const f = aFecha(ultima);
        const inicioUlt = new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime();
        diasDesdeUltima = Math.max(0, Math.round((inicioHoy - inicioUlt) / 86400000));
    }

    const duraciones = validas.map(c => Number(c.duracion_minutos)).filter(n => Number.isFinite(n) && n >= 0);
    const duracionPromedio = duraciones.length ? duraciones.reduce((a, b) => a + b, 0) / duraciones.length : null;

    return { totalMes, totalMesAnterior, ultima, diasDesdeUltima, duracionPromedio };
}

export function textoHace(dias: number): string {
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Hace 1 día';
    return `Hace ${dias} días`;
}

export function textoDuracion(min: number): string {
    const total = Math.round(min * 60);
    const m = Math.floor(total / 60);
    const s = total % 60;
    if (m === 0) return `${s} s`;
    return s === 0 ? `${m} min` : `${m} min ${s} s`;
}
