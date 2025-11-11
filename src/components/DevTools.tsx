"use client";

import { useEffect } from 'react';

export default function DevTools() {
  useEffect(() => {
    // Only load in development
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/test-auth').then((module) => {
        // Make test functions available globally
        (window as any).setTestToken = module.setTestToken;
        (window as any).setCustomToken = module.setCustomToken;
        (window as any).clearTestToken = module.clearTestToken;
        
        // Add debug functions
        (window as any).checkToken = () => {
          const token = localStorage.getItem('auth_token') || process.env.NEXT_AUTH_TOKEN;
          console.log('Current token:', token ? `${token.substring(0, 50)}...` : 'No token found');
          return token;
        };
        
        (window as any).testAPI = async () => {
          try {
            const { api } = await import('@/lib/api');
            console.log('Testing API call...');
            const result = await api.get('/inventory/list');
            console.log('API test successful:', result);
          } catch (error) {
            console.error('API test failed:', error);
          }
        };
        
        (window as any).testDirectFetch = async () => {
          try {
            const token = localStorage.getItem('auth_token') || process.env.NEXT_PUBLIC_AUTH_TOKEN;
            console.log('Testing direct fetch (like Apidog)...');
            
            const response = await fetch('http://localhost:13740/v1/inventory/list', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (response.ok) {
              const data = await response.json();
              console.log('Direct fetch successful:', data);
            } else {
              const errorText = await response.text();
              console.error('Direct fetch failed:', errorText);
            }
          } catch (error) {
            console.error('Direct fetch error:', error);
          }
        };
        
        (window as any).decodeToken = () => {
          const token = localStorage.getItem('auth_token') || process.env.NEXT_PUBLIC_AUTH_TOKEN;
          if (!token) {
            console.log('No token found');
            return;
          }
          
          try {
            // Decode JWT payload (without verification)
            const parts = token.split('.');
            if (parts.length !== 3) {
              console.error('Invalid JWT format');
              return;
            }
            
            const payload = JSON.parse(atob(parts[1]));
            const now = Math.floor(Date.now() / 1000);
            
            console.log('Token payload:', {
              issued: new Date(payload.iat * 1000).toLocaleString(),
              expires: new Date(payload.exp * 1000).toLocaleString(),
              isExpired: payload.exp < now,
              timeUntilExpiry: payload.exp - now,
              subject: payload.sub,
              issuer: payload.iss,
            });
          } catch (error) {
            console.error('Failed to decode token:', error);
          }
        };
        
        console.log('🔧 Dev Tools Loaded:');
        console.log('  - setTestToken() - Use environment JWT token');
        console.log('  - setCustomToken(token) - Set a custom JWT token');
        console.log('  - clearTestToken() - Clear the JWT token');
        console.log('  - checkToken() - Check current token');
        console.log('  - testAPI() - Test API call with current token');
        console.log('  - testDirectFetch() - Test direct fetch (like Apidog)');
        console.log('  - decodeToken() - Decode and check token expiry');
      });
    }
  }, []);

  return null; // This component doesn't render anything
}