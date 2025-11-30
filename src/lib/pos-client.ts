import { useAuth } from '@clerk/nextjs';
import { POS, POSFilters, POS_PER_PAGE, mapBackendPOS } from './pos';

// Hook for client-side POS operations with Clerk authentication
export function usePOSClient() {
  const { getToken } = useAuth();

  const fetchPOSList = async (filters: POSFilters = {}) => {
    const { search = "", page = 1, limit = POS_PER_PAGE } = filters;
    
    try {
      // Get Clerk token
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page > 1) params.append('page', page.toString());
      if (limit !== POS_PER_PAGE) params.append('limit', limit.toString());

      const queryString = params.toString();
      const url = `http://localhost:11570/v1/pos/list${queryString ? `?${queryString}` : ''}`;

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
      let posList: POS[] = [];
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
        // Case 1: Response has posList and pagination properties
        if (response.posList && Array.isArray(response.posList)) {
          posList = response.posList.map(mapBackendPOS);
          if (response.pagination) {
            pagination = {
              currentPage: response.pagination.currentPage || page,
              totalPages: response.pagination.totalPages || 1,
              totalItems: response.pagination.totalItems || response.posList.length,
              itemsPerPage: response.pagination.itemsPerPage || limit,
              startIndex: ((response.pagination.currentPage || page) - 1) * (response.pagination.itemsPerPage || limit) + 1,
              endIndex: Math.min(
                (response.pagination.currentPage || page) * (response.pagination.itemsPerPage || limit),
                response.pagination.totalItems || response.posList.length
              ),
            };
          } else {
            pagination.totalItems = response.posList.length;
            pagination.endIndex = response.posList.length;
          }
        }
        // Case 2: Response is directly an array
        else if (Array.isArray(response)) {
          posList = response.map(mapBackendPOS);
          pagination.totalItems = response.length;
          pagination.endIndex = response.length;
        }
        // Case 3: Response has data property
        else if (response.data) {
          if (Array.isArray(response.data)) {
            posList = response.data.map(mapBackendPOS);
            pagination.totalItems = response.data.length;
            pagination.endIndex = response.data.length;
          } else if (response.data.posList) {
            posList = response.data.posList.map(mapBackendPOS);
            if (response.data.pagination) {
              pagination = {
                currentPage: response.data.pagination.currentPage || page,
                totalPages: response.data.pagination.totalPages || 1,
                totalItems: response.data.pagination.totalItems || response.data.posList.length,
                itemsPerPage: response.data.pagination.itemsPerPage || limit,
                startIndex: ((response.data.pagination.currentPage || page) - 1) * (response.data.pagination.itemsPerPage || limit) + 1,
                endIndex: Math.min(
                  (response.data.pagination.currentPage || page) * (response.data.pagination.itemsPerPage || limit),
                  response.data.pagination.totalItems || response.data.posList.length
                ),
              };
            }
          }
        }
      }

      return {
        posList,
        pagination,
      };
    } catch (error) {
      console.error('Failed to fetch POS list:', error);
      throw new Error(
        error instanceof Error 
          ? `POS service error: ${error.message}` 
          : 'Failed to connect to POS service'
      );
    }
  };

  const fetchPOS = async (id: number): Promise<POS> => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const fetchResponse = await fetch(`http://localhost:7450/v1/pos/${id}`, {
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

      if (response.data) {
        return mapBackendPOS(response.data);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Failed to fetch POS ${id}:`, error);
      throw error;
    }
  };

  const deletePOS = async (id: number): Promise<void> => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const fetchResponse = await fetch(`http://localhost:7450/v1/pos/${id}`, {
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
      console.error(`Failed to delete POS ${id}:`, error);
      throw error;
    }
  };

  return {
    fetchPOSList,
    fetchPOS,
    deletePOS,
  };
}
