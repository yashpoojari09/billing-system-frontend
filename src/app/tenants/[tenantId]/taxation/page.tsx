"use client";

import { useState, useEffect } from "react";
import AddTaxRuleForm from "./AddTaxRuleForm";
import { Button } from "@/components/ui/Button"
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
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-center">TaxTable Management</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <Button type="button" onClick={() => router.push(`/tenants/${tenantId}`)} className="flex justify-center items-center sm:justify-start sm:w-auto w-full">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Button>
        {/* Add New Tax Rule Button */}
        <Button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex justify-center sm:justify-end bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
        >
          + Add Tax Rule
        </Button>
      </div>
      {/* TaxTableTable Table */}
      <TaxTable />

      {/* Add TaxTableTable Modal */}
      {isAddModalOpen && <AddTaxRuleForm onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}
