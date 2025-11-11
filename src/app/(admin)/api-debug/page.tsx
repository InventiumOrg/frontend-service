'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useApiClient } from '@/lib/api-client';
import { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ApiDebugPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const { apiRequest } = useApiClient();
  const [debugResults, setDebugResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addDebugResult = (result: any) => {
    setDebugResults(prev => [...prev, { timestamp: new Date().toISOString(), ...result }]);
  };

  const clearResults = () => {
    setDebugResults([]);
  };

  const testClerkToken = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      addDebugResult({
        test: 'Clerk Token',
        success: !!token,
        data: {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token',
        }
      });
    } catch (error) {
      addDebugResult({
        test: 'Clerk Token',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testApiCall = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/inventory/list?limit=1');
      addDebugResult({
        test: 'API Call - Inventory List',
        success: true,
        data: response
      });
    } catch (error) {
      addDebugResult({
        test: 'API Call - Inventory List',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testFormDataCall = async () => {
    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('Name', 'Test Item');
      formData.append('Unit', 'piece');
      formData.append('Quantity', '1');
      formData.append('Measure', 'unit');
      formData.append('Category', 'Test');
      formData.append('Location', 'Test Location');

      const response = await apiRequest('/inventory/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      addDebugResult({
        test: 'API Call - Create Item (Form Data)',
        success: true,
        data: response
      });
    } catch (error) {
      addDebugResult({
        test: 'API Call - Create Item (Form Data)',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testAuthEndpoint = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-auth');
      const data = await response.json();
      addDebugResult({
        test: 'Server Auth Endpoint',
        success: response.ok,
        data
      });
    } catch (error) {
      addDebugResult({
        test: 'Server Auth Endpoint',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading authentication..." />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-4">
            Authentication Required
          </h1>
          <p className="text-red-700 dark:text-red-300">
            Please sign in to test API functionality.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          API & Authentication Debug
        </h1>
        
        {/* User Info */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-400 mb-2">
            Current User
          </h2>
          <div className="text-blue-800 dark:text-blue-300 text-sm space-y-1">
            <div>ID: {user?.id}</div>
            <div>Email: {user?.primaryEmailAddress?.emailAddress}</div>
            <div>Name: {user?.firstName} {user?.lastName}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Debug Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={testClerkToken}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Clerk Token
            </button>
            <button
              onClick={testApiCall}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test API Call
            </button>
            <button
              onClick={testFormDataCall}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Form Data
            </button>
            <button
              onClick={testAuthEndpoint}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Server Auth
            </button>
          </div>
          <div className="mt-4">
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Debug Results
          </h2>
          {debugResults.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No tests run yet. Click the buttons above to start debugging.
            </p>
          ) : (
            <div className="space-y-4">
              {debugResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${
                      result.success
                        ? 'text-green-900 dark:text-green-400'
                        : 'text-red-900 dark:text-red-400'
                    }`}>
                      {result.test}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    result.success
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}>
                    {result.success ? (
                      <pre className="whitespace-pre-wrap overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    ) : (
                      <div>Error: {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}