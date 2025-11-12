"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { InventoryItem } from "@/lib/inventory";
import { useInventoryClient } from "@/lib/inventory-client";

interface InventoryEditFormProps {
  item: InventoryItem;
}

export default function InventoryEditForm({ item }: InventoryEditFormProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { updateInventoryItem } = useInventoryClient();
  const [formData, setFormData] = useState({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    unit: item.unit || 'piece',
    measure: item.measure || 'unit',
    location: item.location || item.supplier,
  });

  // Check authentication status
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.error('❌ User not authenticated - redirecting to sign-in');
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Debug authentication on component mount
  useEffect(() => {
    const debugAuth = async () => {
      if (isLoaded) {
        console.log('🔍 InventoryEditForm Auth Status:', {
          isSignedIn,
          isLoaded,
        });
        
        if (isSignedIn) {
          try {
            const token = await getToken();
            console.log('🔑 Clerk Token Available:', {
              hasToken: !!token,
              tokenPreview: token ? `${token.substring(0, 30)}...` : 'No token',
              tokenLength: token?.length || 0,
            });
          } catch (error) {
            console.error('❌ Failed to get Clerk token:', error);
          }
        }
      }
    };
    
    debugAuth();
  }, [isLoaded, isSignedIn, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication before proceeding
    if (!isSignedIn) {
      alert('You must be signed in to update inventory items.');
      router.push('/sign-in');
      return;
    }

    setIsLoading(true);

    try {
      // Debug: Check token before making the request
      const token = await getToken();

      if (!token) {
        throw new Error('No authentication token available');
      }

      // TEMPORARY WORKAROUND: Use direct fetch (like the working test)
      
      const updateFormData = new URLSearchParams();
      updateFormData.append('Name', formData.name);
      updateFormData.append('Unit', formData.unit);
      updateFormData.append('Quantity', Math.floor(formData.quantity).toString());
      updateFormData.append('Measure', formData.measure);
      updateFormData.append('Category', formData.category);
      updateFormData.append('Location', formData.location);

      const directResponse = await fetch(`${process.env.NEXT_INVENTORY_SERVICE}/${item.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: updateFormData.toString(),
      });

      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        throw new Error(`HTTP ${directResponse.status}: ${errorText}`);
      }

      const responseData = await directResponse.json();
      console.log('✅ Direct fetch update successful:', responseData);

      console.log('✅ Update successful, redirecting...');
      
      // Redirect back to inventory list
      router.push('/inventory');
      router.refresh();
    } catch (error) {
      console.error('❌ Failed to update inventory item:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          alert('Authentication failed. Please sign in again.');
          router.push('/sign-in');
        } else {
          alert(`Failed to update inventory item: ${error.message}`);
        }
      } else {
        alert('Failed to update inventory item. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/inventory');
  };

  const handleDebugAuth = async () => {
    try {
      console.log('🔍 Debugging authentication and inventory API...');
      
      // Test auth endpoint
      const authResponse = await fetch('/api/test-auth');
      const authData = await authResponse.json();
      console.log('Auth debug data:', authData);
      
      // Test inventory debug endpoint
      const inventoryResponse = await fetch('/api/debug-inventory');
      const inventoryData = await inventoryResponse.json();
      console.log('Inventory debug data:', inventoryData);
      
      // Test PUT request
      const putResponse = await fetch('/api/debug-inventory', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'Name=Test&Unit=piece&Quantity=1&Measure=unit&Category=Test&Location=Test',
      });
      const putData = await putResponse.json();
      console.log('PUT debug data:', putData);
      
      alert(`Debug complete - Check console for details. Auth: ${authData.success ? 'OK' : 'FAIL'}, Inventory: ${inventoryData.success ? 'OK' : 'FAIL'}`);
    } catch (error) {
      console.error('Debug error:', error);
      alert('Debug failed - check console');
    }
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You must be signed in to edit inventory items.
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter product name"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter category"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            required
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter quantity"
          />
        </div>

        {/* Unit */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Unit
          </label>
          <select
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="piece">Piece</option>
            <option value="box">Box</option>
            <option value="can">Can</option>
            <option value="package">Package</option>
            <option value="bottle">Bottle</option>
            <option value="bag">Bag</option>
          </select>
        </div>

        {/* Measure */}
        <div>
          <label htmlFor="measure" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Measure
          </label>
          <select
            id="measure"
            value={formData.measure}
            onChange={(e) => setFormData({ ...formData, measure: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="unit">Unit</option>
            <option value="L">Liter (L)</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="g">Gram (g)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="oz">Ounce (oz)</option>
            <option value="lb">Pound (lb)</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="Enter storage location"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px] inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Item'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={handleDebugAuth}
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Debug Auth
          </button>
        )}
      </div>
    </form>
  );
}