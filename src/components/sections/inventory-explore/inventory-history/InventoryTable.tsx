import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import { DataGrid, GridColDef, useGridApiRef, GridApi } from "@mui/x-data-grid";
import DataGridFooter from "components/common/DataGridFooter";
// import <RowsProps></RowsProps> from "data/inventoryList";
import { Typography } from "@mui/material";
import ActionMenu from "./ActionMenu";
import ListInventory from "utils/hooks/fetchInventory";
// import { useAuth } from "@clerk/nextjs";

interface InventoryRow {
  ID: number | string;
  Name: string;
  CreatedAt: string;
  Unit: string;
  Quantity: number;
  Category: string;
  Location: string;
}

// API response types
interface ApiInventoryItem {
  ID: number | string;
  Name: string;
  CreatedAt: string;
  Unit: string;
  Quantity: number;
  Category: string;
  Location: string;
}

interface ApiResponse {
  data?: ApiInventoryItem[];
  items?: ApiInventoryItem[];
  inventories?: ApiInventoryItem[];
}

const columns: GridColDef<InventoryRow>[] = [
  {
    field: "ID",
    headerName: "Inventory Id",
    editable: false,
    align: "left",
    flex: 1,
    minWidth: 60,
    renderHeader: () => (
      <Typography variant="body2" fontWeight={600} ml={1}>
        Inventory Id
      </Typography>
    ),
    renderCell: (params) => (
      <Stack ml={1} height={1} direction="column" alignSelf="center" justifyContent="center">
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "Name",
    headerName: "Name",
    editable: false,
    align: "left",
    flex: 2,
    minWidth: 140,
  },
  {
    field: "CreatedAt",
    headerName: "Date",
    editable: false,
    align: "left",
    flex: 2,
    minWidth: 160,
  },
  {
    field: "Unit",
    headerName: "Unit",
    editable: false,
    align: "left",
    flex: 1,
    minWidth: 80,
  },
  {
    field: "Quantity",
    headerName: "Quantity",
    editable: false,
    align: "left",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "Category",
    headerName: "Category",
    headerAlign: "right",
    align: "right",
    editable: false,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "Location",
    headerName: "Location",
    headerAlign: "right",
    align: "right",
    editable: false,
    flex: 1,
    minWidth: 100,
  },
  {
    field: "action",
    headerAlign: "right",
    align: "right",
    editable: false,
    sortable: false,
    flex: 1,
    minWidth: 100,
    renderHeader: () => <ActionMenu />,
    renderCell: () => <ActionMenu />,
  },
];

interface TaskOverviewTableProps {
  searchText: string;
}

const InventoryTable = ({ searchText }: TaskOverviewTableProps) => {
  const apiRef = useGridApiRef<GridApi>();
  const [inventories, setInventories] = useState<InventoryRow[]>([]);
  const inventoryService = import.meta.env.VITE_INVENTORY_SERVICE || "localhost:13740";
  const logLevel: string = import.meta.env.VITE_LOG_LEVEL
  // const { getToken } = useAuth();

  const normalizeInventoryItem = (item: ApiInventoryItem): InventoryRow => ({
    ID: item.ID,
    Name: item.Name,
    CreatedAt: item.CreatedAt,
    Unit: item.Unit,
    Quantity: item.Quantity,
    Category: item.Category,
    Location: item.Location,
  });

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        // Get token from environment or use auth
        const token = import.meta.env.VITE_AUTH_TOKEN;
        if (!token) {
          console.log("No auth token available in environment");
          return;
        }

        const response = await ListInventory(inventoryService, token);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData: ApiResponse | ApiInventoryItem[] = await response.json();
        if (logLevel === "DEBUG") {
          console.log("API Response:", responseData);
        }


        let inventoryArray: ApiInventoryItem[] = [];

        // Handle different response structures
        if (Array.isArray(responseData)) {
          inventoryArray = responseData;
        } else if (responseData && typeof responseData === "object") {
          inventoryArray = responseData.data || responseData.items || responseData.inventories || [];
        }

        // Normalize and process inventory data
        const processedInventory = inventoryArray.map(normalizeInventoryItem);

        setInventories(processedInventory);
      } catch (err) {
        console.error("Error fetching inventory list:", err);
        setInventories([]);
      }
    };

    fetchInventories();
  }, [])
  useEffect(() => {
    apiRef.current.setQuickFilterValues(searchText.split(/\b\W+\b/).filter((word) => word !== ""));
  }, [searchText]);

  return (
    <DataGrid
      apiRef={apiRef}
      density="standard"
      columns={columns}
      rows={inventories}
      getRowId={(row) => row.ID}
      rowHeight={52}
      disableColumnResize
      disableColumnMenu
      disableColumnSelector
      disableRowSelectionOnClick
      initialState={{
        pagination: { paginationModel: { pageSize: 4 } },
      }}
      autosizeOptions={{
        includeOutliers: true,
        includeHeaders: false,
        outliersFactor: 1,
        expand: true,
      }}
      slots={{
        pagination: DataGridFooter,
      }}
      checkboxSelection
      pageSizeOptions={[5]}
    />
  );
};

export default InventoryTable;
