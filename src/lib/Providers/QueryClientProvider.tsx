'use client'; // This component must be a client component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Optional: Add Devtools for easier debugging in development
import React, { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools are useful, but typically disabled in production */}
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />} */}
    </QueryClientProvider>
  );
}