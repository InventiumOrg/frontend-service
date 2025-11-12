// Utility functions for testing authentication
// Remove this file in production

// Test function to set a JWT token
export function setTestToken() {
  // Use the token from environment variables that was working before
  const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  
  if (!envToken) {
    console.error('No NEXT_PUBLIC_AUTH_TOKEN found in environment variables');
    return;
  }
  
  // Directly set to localStorage without importing auth functions
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', envToken);
    // Also manually set cookie for server-side access
    document.cookie = `auth_token=${envToken}; path=/; secure; samesite=strict`;
  }
  
  console.log('Environment token set for both client and server. Refresh the page to see authenticated data.');
  
  // Decode and show token info
  try {
    const parts = envToken.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      console.log('Token info:', {
        expires: new Date(payload.exp * 1000).toLocaleString(),
        isExpired: payload.exp < now,
        timeLeft: payload.exp - now > 0 ? `${Math.floor((payload.exp - now) / 3600)} hours` : 'EXPIRED'
      });
    }
  } catch (e) {
    console.log('Could not decode token');
  }
}

// Function to use a custom token
export function setCustomToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
    document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
  }
  console.log('Custom token set. Refresh the page to see authenticated data.');
}

// Function to clear test token
export function clearTestToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  console.log('Test token cleared.');
}

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).setTestToken = setTestToken;
  (window as any).clearTestToken = clearTestToken;
}