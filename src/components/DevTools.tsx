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
        
        console.log('🔧 Dev Tools Loaded:');
        console.log('  - setTestToken() - Use environment JWT token');
        console.log('  - setCustomToken(token) - Set a custom JWT token');
        console.log('  - clearTestToken() - Clear the JWT token');
      });
    }
  }, []);

  return null; // This component doesn't render anything
}