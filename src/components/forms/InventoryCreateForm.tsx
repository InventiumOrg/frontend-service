"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function InventoryCreateForm() {
  const router = useRouter();
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'piece',
    measure: 'unit',
    location: '',
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      alert('You must be signed in to update inventory items.');
      router.push('/sign-in');
      return;
    }
    setIsLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Validate required fields
      if (!formData.name.trim()) {
        alert('Product name is required');
        return;
      }
      if (!formData.category.trim()) {
        alert('Category is required');
        return;
      }
      if (formData.quantity < 0) {
        alert('Quantity must be 0 or greater');
        return;
      }

      const createFormData = new URLSearchParams();
      createFormData.append('Name', formData.name);
      createFormData.append('Unit', formData.unit);
      createFormData.append('Quantity', Math.floor(formData.quantity).toString());
      createFormData.append('Measure', formData.measure);
      createFormData.append('Category', formData.category);
      createFormData.append('Location', formData.location);

      //const directResponse = await fetch(`${process.env.NEXT_INVENTORY_SERVICE}/create`, {
      const directResponse = await fetch(`http://localhost:13740/v1/inventory/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: createFormData.toString()
      })
      
      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        throw new Error(`HTTP ${directResponse.status}: ${errorText}`);
      }
      // Redirect back to inventory list
      router.push('/inventory');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          alert('Authentication failed. Please sign in again.');
          router.push('/sign-in');
        } else {
          alert(`Failed to create inventory item: ${error.message}`);
        }
      } else {
        alert('Failed to create inventory item. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/inventory');
  };

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
          {isLoading ? 'Creating...' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-5 py-3.5 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}