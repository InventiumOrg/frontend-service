'use client';

import { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { debugClientAuth } from '@/lib/auth-debug';

export default function AuthDebugPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [debugResult, setDebugResult] = useState<string>('');

  const runClientDebug = () => {
    debugClientAuth();
    setDebugResult('Check console for client auth debug info');
  };

  const testServerAuth = async () => {
    try {
      const response = await fetch('/api/test-auth');
      const result = await response.json();
      setDebugResult(JSON.stringify(result, null, 2));
    } catch (error) {
      setDebugResult(`Error: ${error}`);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);

    const result = {
      allCookies: Object.keys(cookies),
      sessionCookie: cookies['__session'] ? `${cookies['__session'].substring(0, 30)}...` : 'Not found',
      authCookie: cookies['auth_token'] ? `${cookies['auth_token'].substring(0, 30)}...` : 'Not found',
      localStorage: localStorage.getItem('auth_token') ? 'Found' : 'Not found',
    };

    setDebugResult(JSON.stringify(result, null, 2));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clerk Status */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Clerk Status</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
            <p><strong>Signed In:</strong> {isSignedIn ? 'Yes' : 'No'}</p>
            <p><strong>User ID:</strong> {user?.id || 'None'}</p>
            <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress || 'None'}</p>
            <p><strong>Organization:</strong> {user?.organizationMemberships?.[0]?.organization?.name || 'None'}</p>
          </div>
        </div>

        {/* Debug Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Debug Actions</h2>
          <div className="space-y-3">
            <button
              onClick={runClientDebug}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Client Auth
            </button>
            
            <button
              onClick={checkCookies}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Check Cookies
            </button>
            
            <button
              onClick={testServerAuth}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Test Server Auth
            </button>
          </div>
        </div>
      </div>

      {/* Debug Result */}
      {debugResult && (
        <div className="mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Result:</h3>
          <pre className="text-sm overflow-auto">{debugResult}</pre>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm space-y-1">
          <li>• <strong>Debug Client Auth:</strong> Shows client-side authentication info in console</li>
          <li>• <strong>Check Cookies:</strong> Displays available authentication cookies</li>
          <li>• <strong>Test Server Auth:</strong> Tests server-side authentication endpoint</li>
        </ul>
      </div>
    </div>
  );
}