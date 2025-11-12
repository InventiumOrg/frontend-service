// Utility to clear expired authentication tokens
export function clearExpiredTokens(): void {
  if (typeof window === 'undefined') return;
  
  console.log('Clearing all stored authentication tokens...');
  
  // Clear localStorage
  localStorage.removeItem('auth_token');
  
  // Clear sessionStorage
  sessionStorage.removeItem('auth_token');
  
  // Clear cookies
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  console.log('All tokens cleared. Will use environment token on next request.');
}

// Auto-clear on import if we detect expired tokens
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  
  if (storedToken) {
    try {
      const payload = JSON.parse(atob(storedToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp < now) {
        console.log('Detected expired token, auto-clearing...');
        clearExpiredTokens();
      }
    } catch (error) {
      console.log('Detected invalid token, auto-clearing...');
      clearExpiredTokens();
    }
  }
}