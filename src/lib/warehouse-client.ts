import { useAuth } from '@clerk/nextjs';
import { Warehouse, WarehouseFilters, WAREHOUSES_PER_PAGE, mapBackendWarehouse } from './warehouse';

// Hook for client-side warehouse operations with Clerk authentication
export function useWarehouseClient() {
  const { getToken } = useAuth();

  const fetchWarehouses = async (filters: WarehouseFilters = {}) => {
    const { search = "", page = 1, limit = WAREHOUSES_PER_PAGE } = filters;
    
    try {
      // Get Clerk token
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build query parameters (only add if needed)
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      // Only add pagination if not default values
      if (page > 1) params.append('page', page.toString());
      if (limit !== WAREHOUSES_PER_PAGE) params.append('limit', limit.toString());

      const queryString = params.toString();
      const url = `http://localhost:7450/v1/warehouse/list${queryString ? `?${queryString}` : ''}`;

      // Use direct fetch with Authorization header
      const fetchResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        throw new Error(`HTTP ${fetchResponse.status}: ${errorText}`);
      }

      const response = await fetchResponse.json();

      // Handle different response formats
      let warehouses: Warehouse[] = [];
      let pagination = {
        currentPage: page,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: limit,
        startIndex: 1,
        endIndex: 0,
      };

      // Check if response has the expected structure
      if (response && typeof response === 'object') {
        // Case 1: Response has warehouses and pagination properties
        if (response.warehouses && Array.isArray(response.warehouses)) {
          warehouses = response.warehouses.map(mapBackendWarehouse);
          if (response.pagination) {
            pagination = {
              currentPage: response.pagination.currentPage || page,
              totalPages: response.pagination.totalPages || 1,
              totalItems: response.pagination.totalItems || response.warehouses.length,
              itemsPerPage: response.pagination.itemsPerPage || limit,
              startIndex: ((response.pagination.currentPage || page) - 1) * (response.pagination.itemsPerPage || limit) + 1,
              endIndex: Math.min(
                (response.pagination.currentPage || page) * (response.pagination.itemsPerPage || limit),
                response.pagination.totalItems || response.warehouses.length
              ),
            };
          } else {
            // No pagination info, calculate from warehouses
            pagination.totalItems = response.warehouses.length;
            pagination.endIndex = response.warehouses.length;
          }
        }
        // Case 2: Response is directly an array of warehouses
        else if (Array.isArray(response)) {
          warehouses = response.map(mapBackendWarehouse);
          pagination.totalItems = response.length;
          pagination.endIndex = response.length;
        }
        // Case 3: Response has data property
        else if (response.data) {
          if (Array.isArray(response.data)) {
            // Map backend fields to frontend interface
            warehouses = response.data.map(mapBackendWarehouse);
            pagination.totalItems = response.data.length;
            pagination.endIndex = response.data.length;
          } else if (response.data.warehouses) {
            warehouses = response.data.warehouses.map(mapBackendWarehouse);
            if (response.data.pagination) {
              pagination = {
                currentPage: response.data.pagination.currentPage || page,
                totalPages: response.data.pagination.totalPages || 1,
                totalItems: response.data.pagination.totalItems || response.data.warehouses.length,
                itemsPerPage: response.data.pagination.itemsPerPage || limit,
                startIndex: ((response.data.pagination.currentPage || page) - 1) * (response.data.pagination.itemsPerPage || limit) + 1,
                endIndex: Math.min(
                  (response.data.pagination.currentPage || page) * (response.data.pagination.itemsPerPage || limit),
                  response.data.pagination.totalItems || response.data.warehouses.length
                ),
              };
            }
          }
        }
      }

      return {
        warehouses,
        pagination,
      };
    } catch (error) {
      console.error('Failed to fetch warehouses:', error);
      // Throw error instead of using fallback data
      throw new Error(
        error instanceof Error 
          ? `Warehouse service error: ${error.message}` 
          : 'Failed to connect to warehouse service'
      );
    }
  };

  const fetchWarehouse = async (id: number): Promise<Warehouse> => {
    try {
      // Get Clerk token
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Use direct fetch with Authorization header
      const fetchResponse = await fetch(`http://localhost:13741/v1/warehouse/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        throw new Error(`HTTP ${fetchResponse.status}: ${errorText}`);
      }

      const response = await fetchResponse.json();

      // Handle the response format: { message: "...", data: {...} }
      if (response.data) {
        return mapBackendWarehouse(response.data);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Failed to fetch warehouse ${id}:`, error);
      throw error;
    }
  };

  const deleteWarehouse = async (id: number): Promise<void> => {
    try {
      // Get Clerk token
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Use direct fetch with Authorization header
      const fetchResponse = await fetch(`http://localhost:13741/v1/warehouse/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        throw new Error(`HTTP ${fetchResponse.status}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Failed to delete warehouse ${id}:`, error);
      throw error;
    }
  };

  return {
    fetchWarehouses,
    fetchWarehouse,
    deleteWarehouse,
  };
}