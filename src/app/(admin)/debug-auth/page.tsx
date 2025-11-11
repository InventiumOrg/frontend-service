'use client';

import { useState, useEffect } from 'react';
import { clearExpiredTokens } from '@/lib/clear-auth';
// Note: Using legacy auth function for debugging. Consider using Clerk useAuth hook.

export default function DebugAuthPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [envToken, setEnvToken] = useState<string>('');

  useEffect(() => {
    checkTokens();
    setEnvToken(process.env.NEXT_PUBLIC_AUTH_TOKEN || 'Not set');
  }, []);

  const checkTokens = () => {
    // Direct token check without importing problematic auth functions
    const currentToken = typeof window !== 'undefined' 
      ? (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || process.env.NEXT_PUBLIC_AUTH_TOKEN)
      : null;
    
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp && payload.exp < now;
        
        setTokenInfo({
          hasToken: true,
          isExpired,
          expiresAt: new Date(payload.exp * 1000).toLocaleString(),
          payload,
          tokenPreview: `${currentToken.substring(0, 50)}...`,
          source: localStorage.getItem('auth_token') ? 'localStorage' : 
                  sessionStorage.getItem('auth_token') ? 'sessionStorage' : 'environment'
        });
      } catch (error) {
        setTokenInfo({
          hasToken: true,
          isExpired: true,
          error: 'Invalid token format',
          tokenPreview: `${currentToken.substring(0, 50)}...`
        });
      }
    } else {
      setTokenInfo({
        hasToken: false
      });
    }
  };

  const handleClearTokens = () => {
    clearExpiredTokens();
    checkTokens();
  };

  const handleTestAPI = async () => {
    try {
      const response = await fetch('/api/test-auth');
      const result = await response.json();
      console.log('API Test Result:', result);
      alert(`API Test: ${response.ok ? 'Success' : 'Failed'}\nCheck console for details`);
    } catch (error) {
      console.error('API Test Error:', error);
      alert('API Test Failed - Check console for details');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="space-y-6">
        {/* Environment Token */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Token</h2>
          <p className="text-sm text-gray-600 mb-2">NEXT_PUBLIC_AUTH_TOKEN:</p>
          <code className="block bg-white p-2 rounded text-xs break-all">
            {envToken}
          </code>
        </div>

        {/* Current Token Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current Token Status</h2>
          {tokenInfo ? (
            <div className="space-y-2">
              <p><strong>Has Token:</strong> {tokenInfo.hasToken ? 'Yes' : 'No'}</p>
              {tokenInfo.hasToken && (
                <>
                  <p><strong>Source:</strong> {tokenInfo.source}</p>
                  <p><strong>Expired:</strong> 
                    <span className={tokenInfo.isExpired ? 'text-red-600' : 'text-green-600'}>
                      {tokenInfo.isExpired ? ' Yes' : ' No'}
                    </span>
                  </p>
                  {tokenInfo.expiresAt && (
                    <p><strong>Expires At:</strong> {tokenInfo.expiresAt}</p>
                  )}
                  {tokenInfo.error && (
                    <p className="text-red-600"><strong>Error:</strong> {tokenInfo.error}</p>
                  )}
                  <p><strong>Token Preview:</strong></p>
                  <code className="block bg-white p-2 rounded text-xs break-all">
                    {tokenInfo.tokenPreview}
                  </code>
                </>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleClearTokens}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear All Stored Tokens
          </button>
          
          <button
            onClick={checkTokens}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Token Info
          </button>
          
          <button
            onClick={handleTestAPI}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Test API Call
          </button>
        </div>

        {/* Browser Storage Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Browser Storage</h2>
          <div className="space-y-2 text-sm">
            <p><strong>localStorage auth_token:</strong> {localStorage.getItem('auth_token') ? 'Present' : 'Not set'}</p>
            <p><strong>sessionStorage auth_token:</strong> {sessionStorage.getItem('auth_token') ? 'Present' : 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}