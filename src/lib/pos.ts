// POS types and interfaces
export interface POS {
  id: number;
  name: string;
  location: string;
  status: string;
  warehouseId?: number;
  warehouseName?: string;
}

export interface POSFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export interface POSPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
}

export interface POSListResponse {
  posList: POS[];
  pagination: POSPagination;
}

export const POS_PER_PAGE = 10;

// Map backend POS data to frontend interface
export function mapBackendPOS(backendPOS: any): POS {
  return {
    id: backendPOS.id || backendPOS.ID,
    name: backendPOS.name || backendPOS.Name || '',
    location: backendPOS.location || backendPOS.Location || '',
    status: backendPOS.status || backendPOS.Status || 'active',
    warehouseId: backendPOS.warehouseId || backendPOS.WarehouseID || backendPOS.warehouse_id,
    warehouseName: backendPOS.warehouseName || backendPOS.WarehouseName || backendPOS.warehouse_name || '',
  };
}
