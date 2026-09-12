import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', background: 'var(--color-bg)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '16px', background: 'hsl(4 86% 58% / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <AlertTriangle size={32} color="var(--color-danger)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: 400 }}>
            An unexpected error occurred in the application. Our team has been notified.
          </p>
          {this.state.error && (
            <div style={{ background: 'var(--color-surface-1)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '2rem', fontSize: '0.8rem', color: 'var(--color-text-subtle)', maxWidth: 600, overflowX: 'auto', textAlign: 'left' }}>
              <code>{this.state.error.toString()}</code>
            </div>
          )}
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <RefreshCcw size={16} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
