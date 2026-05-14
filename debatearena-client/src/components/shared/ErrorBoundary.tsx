import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-danger" />
          </div>
          <h2 className="text-2xl font-bold">A system anomaly occurred</h2>
          <p className="text-muted max-w-md">
            The DebateArena frontend encountered an unexpected error. 
            {this.state.error && <span className="block mt-2 text-xs font-mono opacity-50">{this.state.error.message}</span>}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
