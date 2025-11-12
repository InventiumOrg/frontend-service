'use client';
import { useState } from 'react';
import { WarehouseFilters } from '@/lib/warehouse';

interface WarehouseFiltersProps {
  filters: WarehouseFilters;
  onFiltersChange: (filters: WarehouseFilters) => void;
  isLoading: boolean;
}

export default function WarehouseFiltersComponent({
  filters,
  onFiltersChange,
  isLoading,
}: WarehouseFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      ...filters,
      search: searchInput,
      page: 1, // Reset to first page when searching
    });
  };

  const handleSearchClear = () => {
    setSearchInput('');
    onFiltersChange({
      ...filters,
      search: '',
      page: 1,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSearchSubmit} className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Warehouses
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, address, city..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleSearchClear}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isLoading}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}