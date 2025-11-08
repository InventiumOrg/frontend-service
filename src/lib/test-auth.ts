// Utility functions for testing authentication
// Remove this file in production

import { setAuthToken } from './auth';

// Test function to set a JWT token
export function setTestToken() {
  // Use the token from environment variables
  const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
  
  if (!envToken) {
    console.error('No NEXT_PUBLIC_AUTH_TOKEN found in environment variables');
    return;
  }
  
  setAuthToken(envToken);
  
  // Also manually set cookie for server-side access
  document.cookie = `auth_token=${envToken}; path=/; secure; samesite=strict`;
  
  console.log('Environment token set for both client and server. Refresh the page to see authenticated data.');
}

// Function to use a custom token
export function setCustomToken(token: string) {
  setAuthToken(token);
  document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
  console.log('Custom token set. Refresh the page to see authenticated data.');
}

// Function to clear test token
export function clearTestToken() {
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  console.log('Test token cleared.');
}

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).setTestToken = setTestToken;
  (window as any).clearTestToken = clearTestToken;
}