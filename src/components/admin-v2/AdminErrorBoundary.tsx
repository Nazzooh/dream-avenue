import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught admin error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-8">
              The admin panel encountered an unexpected error. Don't worry, your data is safe.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left overflow-auto max-h-32">
              <code className="text-xs text-red-600 font-mono">
                {this.state.error?.message || 'Unknown Error'}
              </code>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="admin-btn-primary w-full justify-center"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Dashboard
              </button>
              
              <a
                href="/"
                className="admin-btn-secondary w-full justify-center"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;
