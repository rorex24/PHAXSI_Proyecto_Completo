import React from 'react';

interface Props {
    children?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary capturó un error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
                    <h2>⚠️ Algo salió mal en esta sección.</h2>
                    <p style={{ color: '#666' }}>{this.state.error?.message || 'Error inesperado de renderizado.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: '0.5rem 1rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}
                    >
                        Recargar página
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}