import { useEffect, useState } from 'react';

export interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Ejecuta una función asíncrona al montar y expone carga/error sin lanzar excepciones.
export function useAsync<T>(fn: () => Promise<T>): AsyncState<T> & { reload: () => void } {
    const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let cancelado = false;
        setState(prev => ({ ...prev, loading: true, error: null }));
        fn()
            .then(data => {
                if (!cancelado) setState({ data, loading: false, error: null });
            })
            .catch((e: unknown) => {
                if (!cancelado) setState({ data: null, loading: false, error: e instanceof Error ? e.message : 'Error desconocido' });
            });
        return () => {
            cancelado = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick]);

    return { ...state, reload: () => setTick(t => t + 1) };
}
