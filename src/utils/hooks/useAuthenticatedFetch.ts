import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const useAuthenticatedFetch = () => {
  const { getToken, isSignedIn } = useAuth();

  const authenticatedFetch = useCallback(async (
    url: string, 
    options: FetchOptions = {}
  ): Promise<Response> => {
    if (!isSignedIn) {
      throw new Error('User not authenticated');
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      const { headers = {}, ...restOptions } = options;

      const response = await fetch(url, {
        ...restOptions,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...headers,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  }, [getToken, isSignedIn]);

  return { authenticatedFetch, isSignedIn };
};