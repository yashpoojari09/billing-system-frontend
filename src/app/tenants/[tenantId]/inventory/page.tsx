"use client";

import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventoryForm";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { getInventory } from "@/utils/api";


export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]); // ✅ Store inventory data here

  const router = useRouter();

 // ✅ Fetch inventory data
 const fetchInventory = async () => {
  try {
    const data = await getInventory();
    setInventory(data);
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
};

// ✅ Check for accessToken on page load
useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    router.push("/auth/login");
  }
  fetchInventory(); // ✅ Fetch inventory on mount
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
      <InventoryTable inventory={inventory} fetchInventory={fetchInventory}/>

      {/* Add Inventory Modal */}
      {isAddModalOpen && <AddInventory onClose={() => setIsAddModalOpen(false)}  fetchInventory={fetchInventory}/>}
    </div>
  );
}     