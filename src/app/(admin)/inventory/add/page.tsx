import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import InventoryCreateForm from "@/components/forms/InventoryCreateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Inventory Item | TailAdmin - Next.js Dashboard Template",
  description: "Add new inventory item page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

export default function AddInventoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add New Inventory Item" />
      <div className="space-y-6">
        <ComponentCard title="Create New Inventory Item">
          <InventoryCreateForm />
        </ComponentCard>
      </div>
    </div>
  );
}