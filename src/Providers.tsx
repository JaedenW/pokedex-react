import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchProvider } from './Utils/SearchContext';
import { SelectionProvider } from './Utils/selection';
import { HttpError } from './Utils/fetchJson';

// PokeAPI data is static, so cached responses never go stale
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      // a missing resource won't appear on retry
      retry: (failureCount, error) =>
        !(error instanceof HttpError && error.status === 404) &&
        failureCount < 2,
    },
  },
});

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SelectionProvider>
          <SearchProvider>{children}</SearchProvider>
        </SelectionProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default Providers;
