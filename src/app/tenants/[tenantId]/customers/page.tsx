"use client";

import { useState, useEffect } from "react";
import CustomersTable from "./CustomersTable";
import AddCustomerForm from "./AddCustomerForm";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getCustomers } from "@/utils/api"; // ✅ Ensure this is imported
import { Customer } from "@/types/types"

export default function CustomersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]); // ✅ Explicitly type the state as an array of any
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state

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
    fetchCustomers();
  }, [router]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true); // ✅ Show loading before fetch

      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
    setIsLoading(false); // ✅ Hide loading after fetch

  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]); // ✅ Update table instantly
  };
  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
    );
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
       <h1 className="text-2xl font-bold mb-6 text-center">Customers Management: {tenantId}</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <Button type="button" onClick={() => setIsAddModalOpen(true)} 
          className="flex justify-center sm:justify-end bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
          +
        </Button>
      </div>

      <CustomersTable isLoading={isLoading} customers={customers} setCustomers={setCustomers} onCustomerUpdated={handleCustomerUpdated} />

      <br />

      {/* ✅ Display Add Customer Modal */}
      {isAddModalOpen && (
        <AddCustomerForm
          onClose={() => setIsAddModalOpen(false)}
          onCustomerAdded={handleCustomerAdded} // ✅ Pass function to update list
        />
      )}
    </div>
  );
}
