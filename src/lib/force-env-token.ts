// Force use of environment token by clearing all stored tokens
export function forceUseEnvToken(): void {
  if (typeof window === 'undefined') return;
  
  console.log('🧹 Force clearing all stored tokens to use environment token...');
  
  // Clear all stored tokens
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
  
  // Clear cookies
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Verify environment token is available
  const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  console.log('🔑 Environment token available:', !!envToken);
  
  if (envToken) {
    console.log('✅ Environment token will be used for next API calls');
  } else {
    console.error('❌ No environment token found! Check NEXT_PUBLIC_AUTH_TOKEN in .env');
  }
}

// Auto-run on import in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add to window for manual use
  (window as any).forceUseEnvToken = forceUseEnvToken;
  
  // Auto-clear if we detect any stored tokens
  const hasStoredTokens = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (hasStoredTokens) {
    console.log('🔄 Auto-clearing stored tokens to use fresh environment token...');
    forceUseEnvToken();
  }
}