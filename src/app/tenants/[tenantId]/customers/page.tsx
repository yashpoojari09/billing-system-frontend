"use client";

import { useState, useEffect } from "react";
import CustomersTable from "./CustomersTable";
import AddCustomerForm from "./AddCustomerForm";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getCustomers } from "@/utils/api"; // ✅ Ensure this is imported
import { Customer } from "@/types"

export default function CustomersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]); // ✅ Explicitly type the state as an array of any

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
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
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
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Customers Management: {tenantId}</h1>
      <div className="flex justify-between items-center mb-4">
        <Button type="button" onClick={() => router.push(`/tenants/${tenantId}`)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
          </svg>
        </Button>
        <Button type="button" onClick={() => setIsAddModalOpen(true)}>
          + Add Customer
        </Button>
      </div>
      <CustomersTable customers={customers} setCustomers={setCustomers} onCustomerUpdated={handleCustomerUpdated} />
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
