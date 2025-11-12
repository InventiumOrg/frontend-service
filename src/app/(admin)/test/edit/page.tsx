'use client';

import { useState } from 'react';
import { updateInventoryItem } from '@/lib/inventory';
// Note: Using legacy approach for testing. Consider using useInventoryClient hook.
import '@/lib/force-env-token'; // Ensure clean token state
import { debugTokenRetrieval } from '@/lib/debug-token';

export default function EditPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testAuth = () => {
    console.log('🧪 Testing auth token retrieval...');
    
    // Check environment variable directly
    const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
    console.log('Environment token:', envToken ? `${envToken.substring(0, 30)}...` : 'NOT SET');
    
    // Check stored tokens
    const localToken = localStorage.getItem('auth_token');
    const sessionToken = sessionStorage.getItem('auth_token');
    console.log('Local storage token:', localToken ? `${localToken.substring(0, 30)}...` : 'NOT SET');
    console.log('Session storage token:', sessionToken ? `${sessionToken.substring(0, 30)}...` : 'NOT SET');
    
    // Get token via direct access (avoiding problematic imports)
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || process.env.NEXT_PUBLIC_AUTH_TOKEN)
      : null;
    console.log('getAuthToken() result:', token ? `${token.substring(0, 30)}...` : 'NULL');
    
    setResult(`Environment Token: ${envToken ? 'Found' : 'Missing'}
Local Storage: ${localToken ? 'Found' : 'Empty'}
Session Storage: ${sessionToken ? 'Found' : 'Empty'}
getAuthToken(): ${token ? 'Found' : 'NULL'}

Check console for full details`);
  };

  const testEdit = async () => {
    setIsLoading(true);
    setResult('Testing edit...');
    
    try {
      // Test with minimal update (just quantity)
      const result = await updateInventoryItem(1, {
        quantity: Math.floor(Math.random() * 100) + 1
      });
      
      setResult(`✅ Success!\nUpdated item: ${result.name}\nQuantity: ${result.quantity}\nUnit: ${result.unit}\nCategory: ${result.category}`);
    } catch (error) {
      console.error('Edit test failed:', error);
      setResult(`❌ Failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck console for detailed error info`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullEdit = async () => {
    setIsLoading(true);
    setResult('Testing full edit...');
    
    try {
      // Test with all fields matching the working curl example
      const result = await updateInventoryItem(1, {
        name: 'Regular Coffee',
        quantity: 180,
        unit: 'kg',
        measure: 'bag',
        category: 'Coffee',
        location: 'Warehouse 10'
      });
      
      setResult(`✅ Full Edit Success!\nName: ${result.name}\nQuantity: ${result.quantity}\nUnit: ${result.unit}\nMeasure: ${result.measure}\nCategory: ${result.category}\nLocation: ${result.location}`);
    } catch (error) {
      console.error('Full edit test failed:', error);
      setResult(`❌ Full Edit Failed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck console for detailed error info`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCurlFormat = async () => {
    setIsLoading(true);
    setResult('Testing exact curl format...');
    
    try {
      // Test the exact same data as the working curl command
      const formData = new URLSearchParams();
      formData.append('Name', 'Regular Coffee');
      formData.append('Unit', 'kg');
      formData.append('Quantity', '180');
      formData.append('Measure', 'bag');
      formData.append('Category', 'Coffee');
      formData.append('Location', 'Warehouse 10');

      console.log('🧪 Testing exact curl format:');
      console.log('Form data string:', formData.toString());

      const response = await fetch('http://localhost:13740/v1/inventory/1', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setResult(`✅ Curl Format Success!\nResponse: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Curl format test failed:', error);
      setResult(`❌ Curl Format Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTokens = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setResult('✅ All tokens cleared. Environment token will be used.');
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Inventory Edit Authentication Test</h1>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testAuth}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check Auth Token
          </button>
          
          <button
            onClick={debugTokenRetrieval}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Deep Debug
          </button>
          
          <button
            onClick={clearTokens}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear All Tokens
          </button>
          
          <button
            onClick={testEdit}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Partial Edit'}
          </button>
          
          <button
            onClick={testFullEdit}
            disabled={isLoading}
            className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-900 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Full Edit'}
          </button>
          
          <button
            onClick={testCurlFormat}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Curl Format'}
          </button>
        </div>
        
        {result && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Environment Info:</h3>
          <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL}</p>
          <p><strong>Has Env Token:</strong> {process.env.NEXT_PUBLIC_AUTH_TOKEN ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
}