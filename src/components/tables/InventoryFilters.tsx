"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function InventoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset to page 1 when filtering
      if (name !== "page") {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (value: string) => {
    router.push(`?${createQueryString("search", value)}`);
  };

  const handleStatusChange = (value: string) => {
    router.push(`?${createQueryString("status", value === "All" ? "" : value)}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search by name, ID, or category..."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div className="sm:w-48">
        <select
          defaultValue={searchParams.get("status") ?? "All"}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="All">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
}