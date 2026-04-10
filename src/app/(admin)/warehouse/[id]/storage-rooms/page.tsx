'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWarehouseClient } from '@/lib/warehouse-client';
import { Warehouse } from '@/lib/warehouse';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@clerk/nextjs';

export default function StorageRoomsPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { fetchWarehouse } = useWarehouseClient();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const warehouseId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    if (isLoaded && isSignedIn && warehouseId) {
      loadWarehouse();
    }
  }, [isLoaded, isSignedIn, warehouseId]);

  const loadWarehouse = async () => {
    if (!warehouseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const warehouseData = await fetchWarehouse(warehouseId);
      setWarehouse(warehouseData);
    } catch (err) {
      console.error('Failed to load warehouse:', err);
      setError(err instanceof Error ? err.message : 'Failed to load warehouse');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to access storage rooms.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading warehouse details..." />
      </div>
    );
  }

  if (error || !warehouse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Warehouse
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Warehouse not found'}
          </p>
          <button
            onClick={() => router.push('/warehouse')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Warehouses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push(`/warehouse/${warehouse.id}`)}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Storage Rooms
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {warehouse.name} - {warehouse.city}, {warehouse.country}
            </p>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        >
          Add Storage Room
        </button>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Storage Room Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Storage room functionality is coming soon. You'll be able to view, add, edit, and manage storage rooms within this warehouse.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-lg mx-auto">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
              Planned Features:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• View all storage rooms in this warehouse</li>
              <li>• Add new storage rooms with room numbers</li>
              <li>• Edit storage room details</li>
              <li>• Delete storage rooms</li>
              <li>• Search and filter storage rooms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}