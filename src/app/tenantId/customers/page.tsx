"use client";

import { useState, useEffect } from "react";
import CustomersTable from "./CustomersTable";
import AddCustomerForm from "./AddCustomerForm";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useParams } from "next/navigation";


export default function CustomersPage() {
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


  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // ✅ Remove access token
    router.push("/"); // ✅ Redirect to login page
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Customers Management: {tenantId}</h1>

      <div className="flex justify-end mb-4">
        <Button type="button" onClick={() => setIsAddModalOpen(true)}>
          + Add Customer
        </Button>
      </div>
    <CustomersTable />
    <br/>  

      {isAddModalOpen && <AddCustomerForm onClose={() => setIsAddModalOpen(false)} />}
      <Button type="button"
          onClick={handleLogout} 
          className="bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </Button>
    </div>
  );
}
