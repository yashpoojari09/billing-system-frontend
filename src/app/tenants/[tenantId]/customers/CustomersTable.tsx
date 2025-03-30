"use client";

import { useState, useEffect } from "react";
import { getCustomers, deleteCustomer } from "@/utils/api";
import EditCustomerForm from "./EditCustomerForm";
import AddCustomerForm from "./AddCustomerForm";

interface CustomersTableProps {
  customers: { id: string; name: string; email: string }[];
}

export default function CustomersTable({ customers }: CustomersTableProps) {
  const [customerList, setCustomerList] = useState<{ id: string; name: string; email: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // ✅ Loading state
  const [error, setError] = useState<string | null>(null); // ✅ Error state
  const [editCustomer, setEditCustomer] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);


  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomerList(data);
    } catch (error) {
      setError("Failed to fetch customers.");
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers(); // Refresh the list
      } catch (error) {
        alert("Failed to delete customer.");
        console.error("Error deleting customer:", error);
      }
    }
  };

  
  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-[#000000]">Customers List</h2>
         {/* ✅ Show error if fetch fails */}
         {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Show loading state */}
      {isLoading ? (
        <p className="text-gray-500">Loading customers...</p>
      ) : (
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-[#000000]">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
        {customerList.length > 0 ? (
          customerList.map((customer) => (
            <tr key={customer.id} className="border text-[#001e38]">
              <td className="p-2 border">{customer.name}</td>
              <td className="p-2 border">{customer.email}</td>
              <td className="p-2 border">
                <button onClick={() => setEditCustomer(customer)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(customer.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          )) ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    )}

    {/* ✅ Show edit form if editCustomer is set */}
    {editCustomer && (
      <EditCustomerForm
        customer={editCustomer}
        onClose={() => setEditCustomer(null)}
        onUpdate={fetchCustomers} // Pass fetchCustomers as the onUpdate handler
      />
    )}
  </div>
);
}