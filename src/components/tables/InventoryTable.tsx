"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import Pagination from "./Pagination";

interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  supplier: string;
  lastUpdated: string;
}

// Sample inventory data
const inventoryData: InventoryItem[] = [
  {
    id: 1,
    sku: "SKU-001",
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
    sku: "SKU-002",
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
    sku: "SKU-003",
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
    sku: "SKU-004",
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
    sku: "SKU-005",
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
    sku: "SKU-006",
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
    sku: "SKU-007",
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
    sku: "SKU-008",
    name: "Ceramic Coffee Mug Set",
    category: "Kitchen",
    quantity: 60,
    price: 34.99,
    status: "In Stock",
    supplier: "KitchenCraft Ltd",
    lastUpdated: "2024-11-07",
  },
];

const ITEMS_PER_PAGE = 5;

export default function InventoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Filter data based on search and status
  const filteredData = inventoryData.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusBadgeColor = (status: string) => {
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
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name, ID, or category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset to first page on filter
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1200px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Quantity
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Supplier
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Last Updated
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-mono text-theme-sm text-gray-800 dark:text-white/90">
                          {item.sku}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.category}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <span className={`font-medium text-theme-sm ${
                          item.quantity === 0 
                            ? 'text-red-600 dark:text-red-400' 
                            : item.quantity <= 10 
                            ? 'text-yellow-600 dark:text-yellow-400' 
                            : 'text-gray-800 dark:text-white/90'
                        }`}>
                          {item.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                        {formatPrice(item.price)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <Badge
                          size="sm"
                          color={getStatusBadgeColor(item.status)}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {item.supplier}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatDate(item.lastUpdated)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log(`Edit item ${item.id}`)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => console.log(`Delete item ${item.id}`)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="col-span-full">
                        No inventory items found matching your criteria.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > ITEMS_PER_PAGE && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} items
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}