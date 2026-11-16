// Interpreta de forma tolerante el texto libre de horarios: "08:00, 20:00", "8am y 8pm", "8h 20h".
// Devuelve minutos desde medianoche, ordenados y sin repetir. Si no se entiende, devuelve [].
export function parseHorarios(texto?: string | null): number[] {
    if (!texto) return [];
    if (/cada/i.test(texto)) return []; // "cada 8 horas" no es un horario fijo
    const re = /(\d{1,2})(?:[:.h](\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?)?/gi;
    const res = new Set<number>();
    let m: RegExpExecArray | null;
    while ((m = re.exec(texto)) !== null) {
        let h = parseInt(m[1], 10);
        const min = m[2] !== undefined ? parseInt(m[2], 10) : 0;
        const suf = (m[3] || '').toLowerCase().replace(/[\s.]/g, '');
        if (suf === 'pm' && h < 12) h += 12;
        if (suf === 'am' && h === 12) h = 0;
        if (h > 23 || min > 59) continue;
        res.add(h * 60 + min);
    }
    return Array.from(res).sort((a, b) => a - b);
}

export function formatoHora(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
