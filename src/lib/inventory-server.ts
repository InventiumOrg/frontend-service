import { cookies } from 'next/headers';
import { api } from './api';
import { InventoryItem, InventoryFilters, InventoryApiResponse, ITEMS_PER_PAGE, getInventoryItemsFallback } from './inventory';

// Get server-side auth token from cookies or environment
async function getServerAuthToken(): Promise<string | null> {
  try {
    // First try to get from cookies
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth_token')?.value;
    if (cookieToken) return cookieToken;
    
    // Fallback to environment variable for development
    return process.env.NEXT_AUTH_TOKEN || process.env.NEXT_PUBLIC_AUTH_TOKEN || null;
  } catch {
    // If cookies fail, try environment variable
    return process.env.NEXT_AUTH_TOKEN || process.env.NEXT_PUBLIC_AUTH_TOKEN || null;
  }
}

// Server-side API function to fetch inventory items
export async function fetchInventoryItemsServer(filters: InventoryFilters = {}): Promise<{
  items: InventoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
  };
}> {
  const { search = "", status = "All", page = 1, limit = ITEMS_PER_PAGE } = filters;

  try {
    // Get auth token for server-side requests
    const serverToken = await getServerAuthToken();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = `/inventory/list${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<any>(endpoint, {}, serverToken || undefined);
    
    // Log the actual response to understand the structure
    console.log('API Response:', JSON.stringify(response, null, 2));
    
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
          const { mapBackendItem } = await import('./inventory');
          items = response.data.map(mapBackendItem);
          pagination.totalItems = response.data.length;
          pagination.endIndex = response.data.length;
        } else if (response.data.items) {
          const { mapBackendItem } = await import('./inventory');
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
    
    // Fallback to sample data for development
    return getInventoryItemsFallback(filters);
  }
}

// Server-side function to fetch a single inventory item
export async function fetchInventoryItemServer(id: number): Promise<InventoryItem> {
  try {
    const serverToken = await getServerAuthToken();
    return await api.get<InventoryItem>(`/inventory/${id}`, {}, serverToken || undefined);
  } catch (error) {
    console.error(`Failed to fetch inventory item ${id}:`, error);
    throw error;
  }
}

// Server-side function to create a new inventory item
export async function createInventoryItemServer(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  try {
    const serverToken = await getServerAuthToken();
    return await api.post<InventoryItem>('/inventory', item, {}, serverToken || undefined);
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    throw error;
  }
}

// Server-side function to update an inventory item
export async function updateInventoryItemServer(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
  try {
    const serverToken = await getServerAuthToken();
    return await api.put<InventoryItem>(`/inventory/${id}`, item, {}, serverToken || undefined);
  } catch (error) {
    console.error(`Failed to update inventory item ${id}:`, error);
    throw error;
  }
}

// Server-side function to delete an inventory item
export async function deleteInventoryItemServer(id: number): Promise<void> {
  try {
    const serverToken = await getServerAuthToken();
    await api.delete(`/inventory/${id}`, {}, serverToken || undefined);
  } catch (error) {
    console.error(`Failed to delete inventory item ${id}:`, error);
    throw error;
  }
}