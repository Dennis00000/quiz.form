import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client - IMPORTANT: no additional configuration
const queryClient = new QueryClient();

/**
 * Provider for React Query
 * Manages data fetching, caching, and synchronization
 */
const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Export the query client for use in hooks
export { queryClient };
export default QueryProvider; 