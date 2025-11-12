// Client-side auth utilities - safe for client components

// Get token from cookies (client-side)
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Legacy function for backward compatibility - now uses session cookie
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: should use getServerAuthToken instead
    console.warn('getAuthToken called on server-side. Use getServerAuthToken from auth-server.ts');
    return null;
  }
  
  // Try to get token from __session cookie (Clerk's default)
  const sessionToken = getCookieValue('__session');
  if (sessionToken) {
    console.log('✅ Using __session cookie token');
    return sessionToken;
  }
  
  // Fallback to auth_token cookie (legacy)
  const authToken = getCookieValue('auth_token');
  if (authToken) {
    console.log('✅ Using auth_token cookie (legacy)');
    return authToken;
  }
  
  // Last resort: localStorage (for development/testing)
  const localToken = localStorage.getItem('auth_token');
  if (localToken) {
    console.log('✅ Using localStorage token (development)');
    return localToken;
  }
  
  console.warn('❌ No authentication token found in cookies or localStorage');
  return null;
}

// Deprecated functions - kept for backward compatibility
export function setAuthToken(token: string): void {
  console.warn('setAuthToken is deprecated. Clerk handles token management automatically.');
}

export function removeAuthToken(): void {
  console.warn('removeAuthToken is deprecated. Use Clerk signOut instead.');
}

export function isAuthenticated(): boolean {
  console.warn('isAuthenticated is deprecated. Use Clerk useAuth hook instead.');
  return !!getAuthToken();
}