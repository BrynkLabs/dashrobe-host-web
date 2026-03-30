import { Component, type ReactNode } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'Geist, sans-serif' }}>
          <h1 style={{ color: '#220E92', fontSize: 24, fontWeight: 700 }}>
            Something went wrong
          </h1>
          <pre
            style={{
              marginTop: 16,
              padding: 16,
              background: '#f5f5f5',
              borderRadius: 8,
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            style={{
              marginTop: 16,
              padding: '10px 24px',
              background: '#220E92',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}