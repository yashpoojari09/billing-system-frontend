"use client";

import { useState, useEffect } from "react";
import CustomersTable from "./CustomersTable";
import AddCustomerForm from "./AddCustomerForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getCustomers } from "@/utils/api"; // ✅ Ensure this is imported
import { Customer } from "@/types/types"
import { FiPlus } from "react-icons/fi";

export default function CustomersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]); // ✅ Explicitly type the state as an array of any
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state

  const router = useRouter();
  // const params = useParams();
  // const tenantId = params?.tenantId;

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
       <h1 className="text-2xl font-bold mb-6 text-center">Customers Management</h1>
       <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full">


      <div className="flex flex-col justify-end sm:flex-row justify-between items-center mb-4 gap-4">
        <Button type="button" onClick={() => setIsAddModalOpen(true)} 
    >
          <FiPlus className="h-5 w-5" />

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
    </div>
  );
}
