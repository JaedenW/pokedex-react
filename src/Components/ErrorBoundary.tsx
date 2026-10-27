import { Component, type ReactNode } from 'react';
import { Link } from 'react-router';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { HttpError } from '../Utils/fetchJson';
import { Page, buttonClass } from './ui';

function ErrorView({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const notFound = error instanceof HttpError && error.status === 404;

  return (
    <Page>
      <div className="ds-frame px-5 py-14 text-center">
        <h1 className="t-h1 text-pk-ink">
          {notFound ? 'Nothing found here' : 'Something went wrong'}
        </h1>
        <p className="mx-auto mt-2 max-w-md t-body text-pk-muted">
          {notFound
            ? "That page doesn't exist in the Pokédex."
            : "We couldn't reach PokeAPI. Check your connection and try again."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {!notFound && (
            <button
              type="button"
              onClick={onRetry}
              className={buttonClass('primary', 'lg')}
            >
              Try again
            </button>
          )}
          <Link to="/" className={buttonClass('accent', 'lg')}>
            Back to the Pokédex
          </Link>
        </div>
      </div>
    </Page>
  );
}

interface BoundaryProps {
  children: ReactNode;
  resetKey: string;
  onReset: () => void;
}

class Boundary extends Component<BoundaryProps, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(previous: BoundaryProps) {
    // leaving the page that failed clears the error
    if (this.state.error && previous.resetKey !== this.props.resetKey) {
      this.props.onReset();
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <ErrorView
        error={error}
        onRetry={() => {
          this.props.onReset();
          this.setState({ error: null });
        }}
      />
    );
  }
}

export default function ErrorBoundary({
  children,
  resetKey,
}: {
  children: ReactNode;
  resetKey: string;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Boundary resetKey={resetKey} onReset={reset}>
          {children}
        </Boundary>
      )}
    </QueryErrorResetBoundary>
  );
}
