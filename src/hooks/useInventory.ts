"use client";

import { useState, useEffect } from 'react';
import { InventoryItem, InventoryFilters, fetchInventoryItems } from '@/lib/inventory';

interface UseInventoryResult {
  items: InventoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
  };
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInventory(filters: InventoryFilters = {}): UseInventoryResult {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
    startIndex: 1,
    endIndex: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchInventoryItems(filters);
      setItems(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(filters)]); // Re-fetch when filters change

  return {
    items,
    pagination,
    loading,
    error,
    refetch: fetchData,
  };
}