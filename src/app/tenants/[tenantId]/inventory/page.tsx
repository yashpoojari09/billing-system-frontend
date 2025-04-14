"use client";

import { useState, useEffect } from "react";
import InventoryTable from "./InventoryTable";
import AddInventory from "./AddInventoryForm";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { getInventory } from "@/utils/api";
import { getTaxRules } from "@/utils/api";
import { TaxRuleProps } from "@/types/taxRule";
import { FiPlus } from "react-icons/fi";


export default function InventoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState([]); // ✅ Store inventory data here
  const [isLoading, setIsLoading] = useState(false);
  const [taxRule, setTaxRule] = useState<TaxRuleProps[]>([]); // ✅ Store inventory data here

  const router = useRouter();
  const PAGE_SIZE = 10;
const [currentPage, setCurrentPage] = useState(1);

const paginatedInventory = Array.isArray(inventory)
? inventory.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE)
:[];

const totalPages = Math.ceil(inventory.length / PAGE_SIZE);


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
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <h1 className="text-2xl font-bold mb-6 text-center">Inventory Management</h1>
      <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full">

      {/* Add Inventory Button */}
      <div className="flex flex-col justify-end sm:flex-row  justify-between items-center mb-4 gap-4">

        <Button type="button" onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                  <FiPlus className="h-5 w-5" />
        
        </Button>
      </div>

      {/* Inventory Table */}
      <InventoryTable isLoading={isLoading} inventory={paginatedInventory} fetchInventory={fetchInventory} 
      fetchTaxRules={fetchTaxRules} taxRules={taxRule}
      />
 {!isLoading && inventory.length > PAGE_SIZE && (
  <div className="flex justify-between items-center mt-4 text-white">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 cursor-pointer"
    >
      Previous
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 cursor-pointer"
    >
      Next
    </button>
  </div>
)}
      {/* Add Inventory Modal */}
      {isAddModalOpen && <AddInventory onClose={() => setIsAddModalOpen(false)}  
      fetchInventory={fetchInventory} fetchTaxRules={fetchTaxRules} taxes={taxRule}/>}
    </div>
    </div>  
    );
}     