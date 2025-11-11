'use client';

import React from 'react';
import { useAuth } from '@clerk/nextjs';

// Client-side auth token retrieval using Clerk
export function useAuthToken(): string | null {
  const { getToken } = useAuth();
  
  // This is a hook, so it can only be used in React components
  const [token, setToken] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchToken = async () => {
      try {
        const clerkToken = await getToken();
        setToken(clerkToken);
      } catch (error) {
        console.error('Failed to get Clerk token:', error);
        setToken(null);
      }
    };
    
    fetchToken();
  }, [getToken]);
  
  return token;
}