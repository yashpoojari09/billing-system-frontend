"use client";

import { useState } from "react";
import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventoryForm";

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory Management</h1>

      {/* Add Inventory Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          + Add Inventory
        </button>
      </div>

      {/* Inventory Table */}
      <InventoryTable />

      {/* Add Inventory Modal */}
      {isAddModalOpen && <AddInventory onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}
