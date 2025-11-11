'use client';

import { useInventoryClient } from '@/lib/inventory-client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

// Example component showing how to use Clerk with inventory operations
export default function ClerkInventoryExample() {
  const { user, isLoaded } = useUser();
  const { fetchInventoryItems } = useInventoryClient();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchItems = async () => {
    setLoading(true);
    try {
      const result = await fetchInventoryItems();
      setItems(result.items);
      console.log('Fetched items with Clerk auth:', result);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading user...</div>;
  }

  if (!user) {
    return <div>Please sign in to access inventory.</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Clerk + Inventory Example</h3>
      
      <div className="mb-4">
        <p><strong>User:</strong> {user.fullName || user.emailAddresses[0]?.emailAddress}</p>
        <p><strong>Organization:</strong> {user.organizationMemberships?.[0]?.organization?.name || 'Personal'}</p>
      </div>

      <button
        onClick={handleFetchItems}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Inventory Items'}
      </button>

      {items.length > 0 && (
        <div className="mt-4">
          <p><strong>Items loaded:</strong> {items.length}</p>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
            {JSON.stringify(items.slice(0, 2), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}