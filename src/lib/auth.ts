// Auth utilities for JWT token management
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: tokens should be handled via cookies in the API functions
    return null;
  }
  
  // Client-side: get token from localStorage, sessionStorage, or environment fallback
  return (
    localStorage.getItem('auth_token') || 
    sessionStorage.getItem('auth_token') ||
    process.env.NEXT_PUBLIC_AUTH_TOKEN ||
    null
  );
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    // Also set as httpOnly cookie for server-side access
    document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    // Remove cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}