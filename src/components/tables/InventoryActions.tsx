"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/button/Button";
import { deleteInventoryItem } from "@/lib/inventory";

interface InventoryActionsProps {
  itemId: number;
}

export default function InventoryActions({ itemId }: InventoryActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    // Navigate to edit page (you can implement this route later)
    router.push(`/inventory/edit/${itemId}`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteInventoryItem(itemId);
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleEdit}>
        Edit
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}