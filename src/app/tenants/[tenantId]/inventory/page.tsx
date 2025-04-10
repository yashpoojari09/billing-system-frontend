"use client";

import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventoryForm";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { getInventory } from "@/utils/api";
import { getTaxRules } from "@/utils/api";
import { TaxRuleProps } from "@/types/taxRule";


export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]); // ✅ Store inventory data here
  const [isLoading, setIsLoading] = useState(false);
  const [taxRule, setTaxRule] = useState<TaxRuleProps[]>([]); // ✅ Store inventory data here

  const router = useRouter();

 // ✅ Fetch inventory data
 const fetchInventory = async () => {
  try {
    setIsLoading(true); // ✅ Show loading before fetch
    const data = await getInventory();
    setInventory(data);
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
  setIsLoading(false); // ✅ Show loading before fetch

};

 // ✅ Fetch inventory data
 const fetchTaxRules = async () => {
  try {
    setIsLoading(true); // ✅ Show loading before fetch
    const data = await getTaxRules();
    setTaxRule(data);
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
  setIsLoading(false); // ✅ Show loading before fetch

};

// ✅ Check for accessToken on page load
useEffect(() => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    router.push("/auth/login");
  }
  fetchInventory(); // ✅ Fetch inventory on mount
  fetchTaxRules(); // ✅ Fetch inventory on mount
}, [router]);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Inventory Management</h1>

      {/* Add Inventory Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0 sm:space-x-4">

        <Button type="button" onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto">
          +
        </Button>
      </div>

      {/* Inventory Table */}
      <InventoryTable isLoading={isLoading} inventory={inventory} fetchInventory={fetchInventory} 
      fetchTaxRules={fetchTaxRules} taxRules={taxRule}
      />

      {/* Add Inventory Modal */}
      {isAddModalOpen && <AddInventory onClose={() => setIsAddModalOpen(false)}  
      fetchInventory={fetchInventory} fetchTaxRules={fetchTaxRules} taxes={taxRule}/>}
    </div>
  );
}     