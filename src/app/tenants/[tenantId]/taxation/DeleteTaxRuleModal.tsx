"use client";

import { deleteTaxRule } from "@/utils/api";
import { useState } from "react";

export default function DeleteTaxRuleModal({ taxId, onClose, onDelete }: { taxId: string; onClose: () => void; onDelete: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTaxRule(taxId);
    onDelete(); // Refresh the table
    setIsDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this tax rule?</p>

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 text-white px-4 py-2 rounded-md">
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
