import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryServiceBanner from "@/components/common/InventoryServiceBanner";
import InventoryTableServer from "@/components/tables/InventoryTableServer";
import InventoryFilters from "@/components/tables/InventoryFilters";
import InventoryPagination from "@/components/tables/InventoryPagination";
import { fetchInventoryItemsServer } from "@/lib/inventory-server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Inventory Management | TailAdmin - Next.js Dashboard Template",
  description:
    "This is the Inventory Management page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

interface InventoryPageProps {
  searchParams: {
    search?: string;
    status?: string;
    page?: string;
  };
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const { search, status, page } = params;

  try {
    const { items, pagination } = await fetchInventoryItemsServer({
      search,
      status,
      page: page ? parseInt(page) : 1,
    });

    return (
      <div>
        <PageBreadcrumb pageTitle="Inventory Management" />
        <div className="space-y-6">
          
          {/* Header with Add Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Inventory Items
            </h2>
            <a
              href="/inventory/add"
              className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600"
            >
              Add New Item
            </a>
          </div>

          <ComponentCard title="">
            <div className="space-y-4">
              <InventoryFilters />
              <InventoryTableServer items={items} />
              {pagination.totalPages > 1 && (
                <InventoryPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  startIndex={pagination.startIndex}
                  endIndex={pagination.endIndex}
                />
              )}
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Inventory page error:', error);
    
    return (
      <div>
        <PageBreadcrumb pageTitle="Inventory Management" />
        <div className="space-y-6">
          
          {/* Service Error Banner */}
          <InventoryServiceBanner 
            error={error instanceof Error ? error.message : 'Unknown error occurred'}
          />
          
          {/* Header with Add Button (disabled) */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Inventory Items
            </h2>
            <button
              disabled
              className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-gray-300 text-gray-500 shadow-theme-xs cursor-not-allowed"
              title="Service unavailable"
            >
              Add New Item
            </button>
          </div>

          <ComponentCard title="">
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>Inventory data cannot be displayed while the service is unavailable.</p>
              <p className="text-sm mt-2">Please resolve the service connection issue and refresh the page.</p>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }
}