import { api, apiRequest } from './api';

export interface InventoryItem {
  id: number;
  // sku: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supplier: string;
  lastUpdated: string;
  // Additional fields from backend
  unit?: string;
  measure?: string;
  location?: string;
}

// Backend API response item structure
export interface BackendInventoryItem {
  ID: number;
  Name: string;
  Unit: string;
  Quantity: number;
  Category: string;
  Measure: string;
  Location: string;
  CreatedAt: string;
}

export interface InventoryApiResponse {
  items: InventoryItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Sample inventory data removed - now using proper error handling instead of fallback

export interface InventoryFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const ITEMS_PER_PAGE = 5;

// Function to map backend item to frontend interface
export function mapBackendItem(backendItem: any): InventoryItem {
  return {
    id: backendItem.ID,
    // sku: `SKU-${backendItem.ID.toString().padStart(3, '0')}`, // Keep for compatibility but not displayed
    name: backendItem.Name,
    category: backendItem.Category,
    quantity: backendItem.Quantity,
    price: 0, // Backend doesn't provide price
    status: backendItem.Quantity > 50 ? "In Stock" : backendItem.Quantity > 10 ? "Low Stock" : "Out of Stock",
    supplier: backendItem.Location || "Unknown", // Use location as supplier for now
    lastUpdated: backendItem.CreatedAt ? backendItem.CreatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
    unit: backendItem.Unit,
    measure: backendItem.Measure,
    location: backendItem.Location,
  };
}

// API function to fetch inventory items (client-side)
export async function fetchInventoryItems(filters: InventoryFilters = {}): Promise<{
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
    // Build query parameters (only add if needed)
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    // Only add pagination if not default values
    if (page > 1) params.append('page', page.toString());
    if (limit !== ITEMS_PER_PAGE) params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = `/inventory/list${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get<any>(endpoint);
    
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
}

// Fallback function removed - now using proper error handling instead

// Individual item operations (client-side)
export async function fetchInventoryItem(id: number): Promise<InventoryItem> {
  try {
    const response = await api.get<any>(`/inventory/${id}`);
    // Handle the response format: { message: "...", data: {...} }
    if (response.data) {
      return mapBackendItem(response.data);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error(`Failed to fetch inventory item ${id}:`, error);
    throw error;
  }
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id' | 'sku'>): Promise<InventoryItem> {
  try {
    console.log('➕ Creating new inventory item with data:', item);
    
    // Validate and prepare data
    const finalQuantity = item.quantity || 0;
    if (isNaN(finalQuantity) || finalQuantity < 0) {
      throw new Error('Quantity must be a valid non-negative number');
    }

    // Create URLSearchParams for application/x-www-form-urlencoded (like curl --form)
    const formData = new URLSearchParams();
    formData.append('Name', item.name || '');
    formData.append('Unit', item.unit || 'piece');
    formData.append('Quantity', Math.floor(finalQuantity).toString()); // Ensure integer
    formData.append('Measure', item.measure || 'unit');
    formData.append('Category', item.category || '');
    formData.append('Location', item.location || item.supplier || '');

    // Log form data contents for debugging
    console.log('📝 Form data contents (all required fields):');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Use the API client with URLSearchParams body (apiRequest will add Authorization header)
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
}

export async function updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
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

    // Create URLSearchParams for application/x-www-form-urlencoded (like curl --form)
    const formData = new URLSearchParams();
    formData.append('Name', item.name || currentItem.name);
    formData.append('Unit', item.unit || currentItem.unit || 'piece');
    formData.append('Quantity', Math.floor(finalQuantity).toString()); // Ensure integer
    formData.append('Measure', item.measure || currentItem.measure || 'unit');
    formData.append('Category', item.category || currentItem.category);
    formData.append('Location', item.location || currentItem.location || '');

    // Log form data contents for debugging
    console.log('📝 Form data contents (all required fields):');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Use the API client with URLSearchParams body (apiRequest will add Authorization header)
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
    throw error;
  }
}

export async function deleteInventoryItem(id: number): Promise<void> {
  try {
    await api.delete(`/inventory/${id}`);
  } catch (error) {
    console.error(`Failed to delete inventory item ${id}:`, error);
    throw error;
  }
}

export function getStatusBadgeColor(status: string) {
  switch (status) {
    case "In Stock":
      return "success";
    case "Low Stock":
      return "warning";
    case "Out of Stock":
      return "error";
    default:
      return "light";
  }
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}