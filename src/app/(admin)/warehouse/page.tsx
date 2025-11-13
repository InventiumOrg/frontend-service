'use client';
import { useState, useEffect } from 'react';
import { useWarehouseClient } from '@/lib/warehouse-client';
import { Warehouse, WarehouseFilters } from '@/lib/warehouse';
import WarehouseTable from '@/components/warehouse/WarehouseTable';
import WarehouseFiltersComponent from '@/components/warehouse/WarehouseFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@clerk/nextjs';

export default function WarehousePage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { fetchWarehouses } = useWarehouseClient();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    startIndex: 1,
    endIndex: 0,
  });
  const [filters, setFilters] = useState<WarehouseFilters>({
    search: '',
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWarehouses = async (currentFilters: WarehouseFilters) => {
    if (!isSignedIn) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchWarehouses(currentFilters);
      setWarehouses(result.warehouses);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load warehouses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load warehouses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadWarehouses(filters);
    }
  }, [isLoaded, isSignedIn, filters]);

  const handleFiltersChange = (newFilters: WarehouseFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleWarehouseDeleted = () => {
    // Reload the current page after deletion
    loadWarehouses(filters);
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
            Please sign in to access the warehouse management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Warehouse Management
        </h1>
      </div>

      <WarehouseFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                Error loading warehouses
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner message="Loading warehouses..." />
        </div>
      ) : (
        <WarehouseTable
          warehouses={warehouses}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          onWarehouseDeleted={handleWarehouseDeleted}
        />
      )}
    </div>
  );
}