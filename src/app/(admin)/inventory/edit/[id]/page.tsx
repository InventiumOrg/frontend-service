import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryEditForm from "@/components/forms/InventoryEditForm";
import { fetchInventoryItemServer } from "@/lib/inventory-server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Inventory Item | TailAdmin - Next.js Dashboard Template",
  description: "Edit inventory item page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

interface EditInventoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditInventoryPage({ params }: EditInventoryPageProps) {
  const { id } = await params;
  const itemId = parseInt(id);

  if (isNaN(itemId)) {
    notFound();
  }

  try {
    const item = await fetchInventoryItemServer(itemId);

    return (
      <div>
        <PageBreadcrumb pageTitle={`Edit Inventory Item #${itemId}`} />
        <div className="space-y-6">
          <ComponentCard title={`Edit: ${item.name}`}>
            <InventoryEditForm item={item} />
          </ComponentCard>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch inventory item:', error);
    notFound();
  }
}