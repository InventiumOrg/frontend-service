'use client';
import { useState, useEffect } from 'react';
import { usePOSClient } from '@/lib/pos-client';
import { POS, POSFilters } from '@/lib/pos';
import POSTable from '@/components/pos/POSTable';
import POSFiltersComponent from '@/components/pos/POSFilters';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@clerk/nextjs';

export default function POSPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { fetchPOSList } = usePOSClient();
  const [posList, setPOSList] = useState<POS[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    startIndex: 1,
    endIndex: 0,
  });
  const [filters, setFilters] = useState<POSFilters>({
    search: '',
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPOSList = async (currentFilters: POSFilters) => {
    if (!isSignedIn) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchPOSList(currentFilters);
      setPOSList(result.posList);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Failed to load POS:', err);
      setError(err instanceof Error ? err.message : 'Failed to load POS');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      loadPOSList(filters);
    }
  }, [isLoaded, isSignedIn, filters]);

  const handleFiltersChange = (newFilters: POSFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePOSDeleted = () => {
    loadPOSList(filters);
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
            Please sign in to access the POS management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Point of Sale (POS) Management
        </h1>
      </div>

      <POSFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoading}
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                Error loading POS
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
          <LoadingSpinner message="Loading POS..." />
        </div>
      ) : (
        <POSTable
          posList={posList}
          pagination={pagination}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          onPOSDeleted={handlePOSDeleted}
        />
      )}
    </div>
  );
}
