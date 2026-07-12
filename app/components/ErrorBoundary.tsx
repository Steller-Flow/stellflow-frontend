"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center px-xl py-3xl text-center">
          <div className="relative mb-lg">
            <div className="absolute inset-0 rounded-full bg-status-error/20 blur-xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-status-error/10">
              <AlertTriangle size={40} className="text-status-error" />
            </div>
          </div>
          <h2 className="font-display mb-sm text-2xl font-semibold text-text-primary">
            Something went wrong
          </h2>
          <p className="mb-xl max-w-md text-text-secondary">
            An unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </p>
          {this.state.error && (
            <p className="mb-lg max-w-lg rounded-lg bg-surface-container-low p-md font-mono text-xs text-text-muted">
              {this.state.error.message}
            </p>
          )}
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex h-11 items-center justify-center gap-sm rounded-lg bg-primary px-xl font-semibold text-on-primary transition hover:bg-primary-hover active:scale-95"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
