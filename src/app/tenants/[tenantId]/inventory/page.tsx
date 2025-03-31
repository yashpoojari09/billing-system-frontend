"use client";

import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventoryForm";
import {Button} from "@/components/ui/Button"
import { useRouter, useParams } from "next/navigation";

export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
    const router = useRouter();
    const params = useParams();

    const tenantId = params?.tenantId;

   // ✅ Check for accessToken on page load
      useEffect(() => {
       const token = localStorage.getItem("accessToken");
       
       if (!token) {
         // ❌ If no token, redirect to login
         router.push("/");
   
       }
     }, [router]);
   
   
  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory Management</h1>

      {/* Add Inventory Button */}
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          + Add Inventory
        </button>
      </div>
       <div className="flex justify-start mb-4">
              <Button type="button" onClick={() => router.push(`/tenants/${tenantId}`)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                </svg>
                 Back To Dashboard
              </Button>
            </div>

      {/* Inventory Table */}
      <InventoryTable />

      {/* Add Inventory Modal */}
      {isAddModalOpen && <AddInventory onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}
