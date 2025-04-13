"use client";

import { useState, useEffect } from "react";
import AddTaxRuleForm from "./AddTaxRuleForm";
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation";
import TaxTable from "./TaxTable";
import { getTaxRules } from "@/utils/api";
import { TaxRuleProps } from "@/types/taxRule";
import { FiPlus } from "react-icons/fi";


export default function TaxTablePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [taxRules, setTaxRules] = useState<TaxRuleProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // ✅ Check for accessToken on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/login");
    }
    fetchTaxRules();
  }, [router]);

  const fetchTaxRules = async () => {
    try{
      setIsLoading(true); // ✅ Show loading before fetch
    const data = await getTaxRules();
    setTaxRules(data);
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
  setIsLoading(false); // ✅ Show loading before fetch

  };


  return (

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-center">TaxTable Management</h1>
      <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full">

      <div className="flex flex-col justify-end sm:flex-row justify-between items-center mb-4 gap-4">
        {/* Add New Tax Rule Button */}
        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex justify-center sm:justify-end bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
        >
                   <FiPlus className="h-5 w-5" />
         
        </Button>
      </div>
      {/* TaxTableTable Table */}
      <TaxTable isLoading={isLoading} taxRules={taxRules} fetchTaxRules={fetchTaxRules}/>

      {/* Add TaxTableTable Modal */}
      {isAddModalOpen && <AddTaxRuleForm onClose={() => setIsAddModalOpen(false)} fetchTaxRules={fetchTaxRules}/>}
    </div>
    </div>
  );
}
