import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
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
          <ComponentCard title="Inventory Items">
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
    return (
      <div>
        <PageBreadcrumb pageTitle="Inventory Management" />
        <div className="space-y-6">
          <ComponentCard title="Inventory Items">
            <div className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-4">
                <h3 className="text-lg font-semibold">Failed to load inventory</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {error instanceof Error ? error.message : 'An unexpected error occurred'}
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }
}