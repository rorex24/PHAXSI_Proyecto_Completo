import type { Crisis } from '../types';

const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const MESES_LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export interface PuntoMes {
    etiqueta: string;
    etiquetaLarga: string;
    total: number;
}

// Crisis por mes en los últimos `cantidad` meses (el mes actual es el último).
export function crisisPorMes(lista: Crisis[], ahora: Date = new Date(), cantidad = 6): PuntoMes[] {
    const puntos: PuntoMes[] = [];
    for (let i = cantidad - 1; i >= 0; i--) {
        const ref = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
        const mes = ref.getMonth();
        const anio = ref.getFullYear();
        const total = lista.filter(c => {
            const f = new Date(c.fecha_hora);
            return !isNaN(f.getTime()) && f.getMonth() === mes && f.getFullYear() === anio;
        }).length;
        puntos.push({ etiqueta: MESES_CORTOS[mes], etiquetaLarga: `${MESES_LARGOS[mes]} de ${anio}`, total });
    }
    return puntos;
}

export interface TipoCrisis {
    nombre: string;
    cantidad: number;
    porcentaje: number;
    color: string;
}

const COLORES = ['#6D28D9', '#DB2777', '#0F766E', '#8B5CF6', '#C026D3'];
const COLOR_OTROS = '#6B7280';

const nombreVisible = (tipo: string): string => {
    const t = tipo.trim();
    if (/^t[oó]nico[- ]?cl[oó]nica$/i.test(t)) return 'Tónico-Clónica generalizada';
    if (/^at[oó]nica$/i.test(t)) return 'Atónica';
    return t || 'Sin especificar';
};

// Distribución por tipo; porcentajes enteros que suman 100 (método del mayor resto).
// Se muestran hasta 4 tipos y el resto se agrupa en "Otros".
export function distribucionTipos(lista: Crisis[]): TipoCrisis[] {
    const conteo = new Map<string, number>();
    for (const c of lista) {
        const n = nombreVisible(String(c.tipo_crisis ?? ''));
        conteo.set(n, (conteo.get(n) ?? 0) + 1);
    }
    const total = lista.length;
    if (total === 0) return [];

    let items = Array.from(conteo.entries())
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre, 'es'));

    if (items.length > COLORES.length) {
        const principales = items.slice(0, COLORES.length - 1);
        const resto = items.slice(COLORES.length - 1).reduce((s, i) => s + i.cantidad, 0);
        items = [...principales, { nombre: 'Otros', cantidad: resto }];
    }

    const exactos = items.map(i => (i.cantidad / total) * 100);
    const base = exactos.map(Math.floor);
    let faltan = 100 - base.reduce((a, b) => a + b, 0);
    const orden = exactos.map((e, idx) => ({ idx, resto: e - Math.floor(e) })).sort((a, b) => b.resto - a.resto);
    for (const o of orden) {
        if (faltan <= 0) break;
        base[o.idx] += 1;
        faltan--;
    }

    return items.map((i, idx) => ({
        nombre: i.nombre,
        cantidad: i.cantidad,
        porcentaje: base[idx],
        color: i.nombre === 'Otros' ? COLOR_OTROS : COLORES[idx]
    }));
}
