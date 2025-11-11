'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useInventoryClient } from '@/lib/inventory-client';

export default function InventoryDebugPage() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { updateInventoryItem, fetchInventoryItem } = useInventoryClient();
  const [debugResults, setDebugResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addDebugResult = (result: any) => {
    setDebugResults(prev => [...prev, { timestamp: new Date().toISOString(), ...result }]);
  };

  const testClerkAuth = async () => {
    try {
      const token = await getToken();
      addDebugResult({
        test: 'Clerk Auth',
        success: !!token,
        data: {
          isSignedIn,
          isLoaded,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token',
          tokenLength: token?.length || 0,
        }
      });
    } catch (error) {
      addDebugResult({
        test: 'Clerk Auth',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const testApiEndpoints = async () => {
    try {
      // Test auth endpoint
      const authResponse = await fetch('/api/test-auth');
      const authData = await authResponse.json();
      
      addDebugResult({
        test: 'API Auth Endpoint',
        success: authData.success,
        data: authData,
      });

      // Test inventory debug endpoint
      const inventoryResponse = await fetch('/api/debug-inventory');
      const inventoryData = await inventoryResponse.json();
      
      addDebugResult({
        test: 'Inventory Debug Endpoint',
        success: inventoryData.success,
        data: inventoryData,
      });
    } catch (error) {
      addDebugResult({
        test: 'API Endpoints',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const testInventoryFetch = async () => {
    try {
      setIsLoading(true);
      const item = await fetchInventoryItem(1); // Try to fetch item with ID 1
      addDebugResult({
        test: 'Fetch Inventory Item',
        success: true,
        data: item,
      });
    } catch (error) {
      addDebugResult({
        test: 'Fetch Inventory Item',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testInventoryUpdate = async () => {
    try {
      setIsLoading(true);
      const result = await updateInventoryItem(1, {
        name: 'Test Update ' + new Date().toLocaleTimeString(),
        quantity: Math.floor(Math.random() * 100) + 1,
        category: 'Test Category',
      });
      addDebugResult({
        test: 'Update Inventory Item',
        success: true,
        data: result,
      });
    } catch (error) {
      addDebugResult({
        test: 'Update Inventory Item',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectDebugEndpoint = async () => {
    try {
      setIsLoading(true);
      
      // Test the debug endpoint directly
      const formData = new URLSearchParams();
      formData.append('Name', 'Debug Test Item');
      formData.append('Unit', 'piece');
      formData.append('Quantity', '42');
      formData.append('Measure', 'unit');
      formData.append('Category', 'Debug');
      formData.append('Location', 'Test Location');

      const response = await fetch('/api/debug-inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      const data = await response.json();
      
      addDebugResult({
        test: 'Direct Debug Endpoint',
        success: response.ok,
        data: data,
      });
    } catch (error) {
      addDebugResult({
        test: 'Direct Debug Endpoint',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setDebugResults([]);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Inventory API Debug
        </h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Authentication Status
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Signed In:</span>
                <span className={`ml-2 ${isSignedIn ? 'text-green-600' : 'text-red-600'}`}>
                  {isSignedIn ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Loaded:</span>
                <span className={`ml-2 ${isLoaded ? 'text-green-600' : 'text-red-600'}`}>
                  {isLoaded ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Debug Tests
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={testClerkAuth}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Clerk Auth
            </button>
            <button
              onClick={testApiEndpoints}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test API Endpoints
            </button>
            <button
              onClick={testInventoryFetch}
              disabled={isLoading || !isSignedIn}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Fetch Item
            </button>
            <button
              onClick={testInventoryUpdate}
              disabled={isLoading || !isSignedIn}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Update Item
            </button>
            <button
              onClick={testDirectDebugEndpoint}
              disabled={isLoading || !isSignedIn}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Test Debug Endpoint
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Debug Results ({debugResults.length})
            </h2>
            <button
              onClick={clearResults}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {debugResults.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No debug results yet. Run some tests above.
              </p>
            ) : (
              debugResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold ${
                      result.success ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
                    }`}>
                      {result.test}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {result.error && (
                    <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                      Error: {result.error}
                    </p>
                  )}
                  
                  {result.data && (
                    <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Running test...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}