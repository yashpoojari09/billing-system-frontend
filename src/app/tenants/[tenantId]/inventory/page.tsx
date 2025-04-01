"use client";

import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventoryForm";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const router = useRouter();

  // ✅ Check for accessToken on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // ❌ If no token, redirect to login
      router.push("/auth/login");

    }
  }, [router]);


  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory Management</h1>

      {/* Add Inventory Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4">

        <Button type="button" onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto">
          + Add Inventory
        </Button>
      </div>

      {/* Inventory Table */}
      <InventoryTable />

      {/* Add Inventory Modal */}
      {isAddModalOpen && <AddInventory onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}     