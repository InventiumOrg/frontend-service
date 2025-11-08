import { api } from './api';

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

// Sample inventory data - fallback for development/testing
export const sampleInventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    quantity: 45,
    price: 89.99,
    status: "In Stock",
    supplier: "TechCorp Ltd",
    lastUpdated: "2024-11-07",
  },
  {
    id: 2,
    name: "Gaming Mechanical Keyboard",
    category: "Electronics",
    quantity: 8,
    price: 129.99,
    status: "Low Stock",
    supplier: "GameGear Inc",
    lastUpdated: "2024-11-06",
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    category: "Furniture",
    quantity: 0,
    price: 299.99,
    status: "Out of Stock",
    supplier: "ComfortSeating Co",
    lastUpdated: "2024-11-05",
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    category: "Accessories",
    quantity: 120,
    price: 24.99,
    status: "In Stock",
    supplier: "EcoBottles Ltd",
    lastUpdated: "2024-11-07",
  },
  {
    id: 5,
    name: "Laptop Stand Adjustable",
    category: "Electronics",
    quantity: 15,
    price: 49.99,
    status: "Low Stock",
    supplier: "WorkSpace Solutions",
    lastUpdated: "2024-11-06",
  },
  {
    id: 6,
    name: "Organic Cotton T-Shirt",
    category: "Clothing",
    quantity: 75,
    price: 19.99,
    status: "In Stock",
    supplier: "GreenWear Co",
    lastUpdated: "2024-11-07",
  },
  {
    id: 7,
    name: "Smart Fitness Tracker",
    category: "Electronics",
    quantity: 3,
    price: 199.99,
    status: "Low Stock",
    supplier: "FitTech Inc",
    lastUpdated: "2024-11-05",
  },
  {
    id: 8,
    name: "Ceramic Coffee Mug Set",
    category: "Kitchen",
    quantity: 60,
    price: 34.99,
    status: "In Stock",
    supplier: "KitchenCraft Ltd",
    lastUpdated: "2024-11-07",
  },
];

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
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'All') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

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
    
    // Fallback to sample data for development
    return getInventoryItemsFallback(filters);
  }
}

// Fallback function using sample data (for development/testing)
export function getInventoryItemsFallback(filters: InventoryFilters = {}) {
  const { search = "", status = "All", page = 1 } = filters;

  // Filter data based on search and status
  let filteredData = sampleInventoryData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toString().includes(search) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = status === "All" || item.status === status;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    items: paginatedData,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: ITEMS_PER_PAGE,
      startIndex: startIndex + 1,
      endIndex: Math.min(startIndex + ITEMS_PER_PAGE, totalItems),
    },
  };
}

// Individual item operations (client-side)
export async function fetchInventoryItem(id: number): Promise<InventoryItem> {
  try {
    return await api.get<InventoryItem>(`/inventory/${id}`);
  } catch (error) {
    console.error(`Failed to fetch inventory item ${id}:`, error);
    throw error;
  }
}

export async function createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  try {
    return await api.post<InventoryItem>('/inventory', item);
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
  try {
    return await api.put<InventoryItem>(`/inventory/${id}`, item);
  } catch (error) {
    console.error(`Failed to update inventory item ${id}:`, error);
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