"use client";

import { useState, useEffect } from "react";
import AddTaxRuleForm from "./AddTaxRuleForm";
import {Button} from "@/components/ui/Button"
import { useRouter, useParams } from "next/navigation";
import TaxTable from "./TaxTable";

export default function TaxTablePage() {
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams()
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">TaxTable Management</h1>
   
              <Button type="button" onClick={() => router.push(`/tenants/${tenantId}`)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>Back To Dashboard
                </svg> 
              </Button>

      {/* Add New Tax Rule Button */}
      <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 justify-end text-white px-4 py-2 rounded-md mb-4">
        + Add Tax Rule
      </button>

    {/* TaxTableTable Table */}
         <TaxTable/>
   
         {/* Add TaxTableTable Modal */}
         {isAddModalOpen && <AddTaxRuleForm onClose={() => setIsAddModalOpen(false)} />}
       </div>
     );
   }