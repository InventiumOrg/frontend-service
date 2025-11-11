import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:13740/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Hook for client-side API requests with Clerk authentication
export function useApiClient() {
  const { getToken } = useAuth();

  const apiRequest = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    // Get Clerk token
    const token = await getToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Prepare headers
    const headers: HeadersInit = {
      ...(options.headers as Record<string, string> || {}),
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      throw new ApiError('Authentication required', 401);
    }

    // Only add Content-Type for JSON requests (not for FormData or if already set)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      headers,
      ...options,
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }
      
      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return {} as T;
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }, [getToken]);

  // HTTP method helpers
  const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { method: 'GET', ...options }),
      
    post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      }),
      
    put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      }),
      
    patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
      apiRequest<T>(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      }),
      
    delete: <T>(endpoint: string, options?: RequestInit) =>
      apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
  };

  return { apiRequest, api };
}