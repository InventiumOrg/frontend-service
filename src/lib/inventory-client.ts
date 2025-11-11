import { useApiClient } from './api-client';
import { InventoryItem, InventoryFilters, ITEMS_PER_PAGE, mapBackendItem } from './inventory';

// Hook for client-side inventory operations with Clerk authentication
export function useInventoryClient() {
  const { apiRequest } = useApiClient();

  const fetchInventoryItems = async (filters: InventoryFilters = {}) => {
    const { search = "", status = "All", page = 1, limit = ITEMS_PER_PAGE } = filters;

    try {
      // Build query parameters (only add if needed)
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status && status !== 'All') params.append('status', status);
      // Only add pagination if not default values
      if (page > 1) params.append('page', page.toString());
      if (limit !== ITEMS_PER_PAGE) params.append('limit', limit.toString());

      const queryString = params.toString();
      const endpoint = `/inventory/list${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest<any>(endpoint);
      
      // Handle different response formats
      let items: InventoryItem[] = [];
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
        // Case 1: Response has items and pagination properties
        if (response.items && Array.isArray(response.items)) {
          items = response.items;
          if (response.pagination) {
            pagination = {
              currentPage: response.pagination.currentPage || page,
              totalPages: response.pagination.totalPages || 1,
              totalItems: response.pagination.totalItems || response.items.length,
              itemsPerPage: response.pagination.itemsPerPage || limit,
              startIndex: ((response.pagination.currentPage || page) - 1) * (response.pagination.itemsPerPage || limit) + 1,
              endIndex: Math.min(
                (response.pagination.currentPage || page) * (response.pagination.itemsPerPage || limit),
                response.pagination.totalItems || response.items.length
              ),
            };
          } else {
            // No pagination info, calculate from items
            pagination.totalItems = response.items.length;
            pagination.endIndex = response.items.length;
          }
        }
        // Case 2: Response is directly an array of items
        else if (Array.isArray(response)) {
          items = response;
          pagination.totalItems = response.length;
          pagination.endIndex = response.length;
        }
        // Case 3: Response has data property
        else if (response.data) {
          if (Array.isArray(response.data)) {
            // Map backend fields to frontend interface
            items = response.data.map(mapBackendItem);
            pagination.totalItems = response.data.length;
            pagination.endIndex = response.data.length;
          } else if (response.data.items) {
            items = response.data.items.map(mapBackendItem);
            if (response.data.pagination) {
              pagination = {
                currentPage: response.data.pagination.currentPage || page,
                totalPages: response.data.pagination.totalPages || 1,
                totalItems: response.data.pagination.totalItems || response.data.items.length,
                itemsPerPage: response.data.pagination.itemsPerPage || limit,
                startIndex: ((response.data.pagination.currentPage || page) - 1) * (response.data.pagination.itemsPerPage || limit) + 1,
                endIndex: Math.min(
                  (response.data.pagination.currentPage || page) * (response.data.pagination.itemsPerPage || limit),
                  response.data.pagination.totalItems || response.data.items.length
                ),
              };
            }
          }
        }
      }

      return {
        items,
        pagination,
      };
    } catch (error) {
      console.error('Failed to fetch inventory items:', error);
      
      // Throw error instead of using fallback data
      throw new Error(
        error instanceof Error 
          ? `Inventory service error: ${error.message}` 
          : 'Failed to connect to inventory service'
      );
    }
  };

  const fetchInventoryItem = async (id: number): Promise<InventoryItem> => {
    try {
      const response = await apiRequest<any>(`/inventory/${id}`);
      // Handle the response format: { message: "...", data: {...} }
      if (response.data) {
        return mapBackendItem(response.data);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Failed to fetch inventory item ${id}:`, error);
      throw error;
    }
  };

  const createInventoryItem = async (item: Omit<InventoryItem, 'id' | 'sku'>): Promise<InventoryItem> => {
    try {
      console.log('➕ Creating new inventory item with data:', item);
      
      // Validate and prepare data
      const finalQuantity = item.quantity || 0;
      if (isNaN(finalQuantity) || finalQuantity < 0) {
        throw new Error('Quantity must be a valid non-negative number');
      }

      // Backend uses ctx.PostForm() - ensure all fields are non-empty strings
      const formData = new URLSearchParams();
      
      // Ensure all required fields have valid values (backend validation is strict)
      const name = (item.name || '').trim();
      const unit = (item.unit || 'piece').trim();
      const measure = (item.measure || 'unit').trim();
      const category = (item.category || '').trim();
      const location = (item.location || item.supplier || '').trim();
      
      // Validate required fields
      if (!name) {
        throw new Error('Name is required and cannot be empty');
      }
      if (!category) {
        throw new Error('Category is required and cannot be empty');
      }
      
      formData.append('Name', name);
      formData.append('Unit', unit);
      formData.append('Quantity', Math.floor(finalQuantity).toString());
      formData.append('Measure', measure);
      formData.append('Category', category);
      formData.append('Location', location);

      // Log form data contents for debugging
      console.log('📝 Form data contents (validated):');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}" (length: ${value.length})`);
      }

      // Use the API client with URLSearchParams body
      const response = await apiRequest<any>(`/inventory/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log('✅ Successfully created inventory item:', response);

      if (response.data) {
        return mapBackendItem(response.data);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Failed to create inventory item:', error);
      throw error;
    }
  };

  const updateInventoryItem = async (id: number, item: Partial<InventoryItem>): Promise<InventoryItem> => {
    try {
      console.log(`🔄 Updating inventory item ${id} with data:`, item);
      
      // First, fetch the current item to get all existing values
      const currentItem = await fetchInventoryItem(id);
      console.log('📋 Current item data:', currentItem);
      
      // Validate and prepare data
      const finalQuantity = item.quantity !== undefined ? item.quantity : currentItem.quantity;
      if (isNaN(finalQuantity) || finalQuantity < 0) {
        throw new Error('Quantity must be a valid non-negative number');
      }

      // Backend uses ctx.PostForm() - ensure all fields are non-empty strings
      const formData = new URLSearchParams();
      
      // Ensure all required fields have valid values (backend validation is strict)
      const name = (item.name || currentItem.name || '').trim();
      const unit = (item.unit || currentItem.unit || 'piece').trim();
      const measure = (item.measure || currentItem.measure || 'unit').trim();
      const category = (item.category || currentItem.category || '').trim();
      const location = (item.location || currentItem.location || '').trim();
      
      // Validate required fields
      if (!name) {
        throw new Error('Name is required and cannot be empty');
      }
      if (!category) {
        throw new Error('Category is required and cannot be empty');
      }
      
      formData.append('Name', name);
      formData.append('Unit', unit);
      formData.append('Quantity', Math.floor(finalQuantity).toString());
      formData.append('Measure', measure);
      formData.append('Category', category);
      formData.append('Location', location);

      // Log form data contents for debugging
      console.log('📝 Form data contents (validated):');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: "${value}" (length: ${value.length})`);
      }

      // Use the API client with URLSearchParams body
      console.log('🔍 Calling apiRequest with form data...');
      const response = await apiRequest<any>(`/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      console.log(`✅ Successfully updated inventory item ${id}:`, response);

      if (response.data) {
        return mapBackendItem(response.data);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`❌ Failed to update inventory item ${id}:`, error);
      
      // Enhanced error logging for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
        
        // Check if it's an API error with more details
        if ('status' in error && 'response' in error) {
          console.error('API Error details:', {
            status: (error as any).status,
            response: (error as any).response,
          });
        }
      }
      
      throw error;
    }
  };

  const deleteInventoryItem = async (id: number): Promise<void> => {
    try {
      await apiRequest(`/inventory/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error(`Failed to delete inventory item ${id}:`, error);
      throw error;
    }
  };

  return {
    fetchInventoryItems,
    fetchInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
  };
}