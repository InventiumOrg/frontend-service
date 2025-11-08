import { getAuthToken } from './auth';

// API configuration
const API_BASE_URL = process.env.NEXT_INVENTORY_API_BASE_URL || 'http://localhost:8000/api';

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

// Generic API client with JWT authentication
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  serverToken?: string
): Promise<T> {
  // Use provided server token or get from client-side storage
  const token = serverToken || getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  
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
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, options?: RequestInit, serverToken?: string) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }, serverToken),
    
  post: <T>(endpoint: string, data?: any, options?: RequestInit, serverToken?: string) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }, serverToken),
    
  put: <T>(endpoint: string, data?: any, options?: RequestInit, serverToken?: string) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }, serverToken),
    
  patch: <T>(endpoint: string, data?: any, options?: RequestInit, serverToken?: string) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    }, serverToken),
    
  delete: <T>(endpoint: string, options?: RequestInit, serverToken?: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }, serverToken),
};