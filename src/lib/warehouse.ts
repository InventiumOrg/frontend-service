// Warehouse types and interfaces
export interface Warehouse {
  id: number;
  name: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  country: string;
}

export interface WarehouseFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface WarehousePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface WarehouseListResponse {
  warehouses: Warehouse[];
  pagination: WarehousePagination;
}

export const WAREHOUSES_PER_PAGE = 10;

// Map backend warehouse data to frontend interface
export function mapBackendWarehouse(backendWarehouse: any): Warehouse {
  return {
    id: backendWarehouse.id || backendWarehouse.ID,
    name: backendWarehouse.name || backendWarehouse.Name || '',
    address: backendWarehouse.address || backendWarehouse.Address || '',
    ward: backendWarehouse.ward || backendWarehouse.Ward || '',
    district: backendWarehouse.district || backendWarehouse.District || '',
    city: backendWarehouse.city || backendWarehouse.City || '',
    country: backendWarehouse.country || backendWarehouse.Country || '',
  };
}