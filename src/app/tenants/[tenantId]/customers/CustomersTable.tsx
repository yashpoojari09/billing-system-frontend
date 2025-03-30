"use client";

import { useState } from "react";
import { deleteCustomer } from "@/utils/api";
import EditCustomerForm from "./EditCustomerForm";
import { CustomersTableProps, Customer } from "@/types";


export default function CustomersTable({ customers, setCustomers }: CustomersTableProps) {
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // ✅ Handle customer deletion
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        setCustomers((prev) => prev.filter((cust) => cust.id !== id)); // ✅ Remove from state
      } catch (error) {
        alert("Failed to delete customer.");
        console.error("Error deleting customer:", error);
      }
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-[#000000]">Customers List</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-[#000000]">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id} className="border text-[#001e38]">
                <td className="p-2 border">{customer.name}</td>
                <td className="p-2 border">{customer.email}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => setEditCustomer(customer)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Show EditCustomerForm */}
      {editCustomer && (
        <EditCustomerForm
          customer={editCustomer}
          onClose={() => setEditCustomer(null)}
          onUpdate={(updatedCustomer) => {
            setCustomers((prev) =>
              prev.map((cust) => (cust.id === updatedCustomer.id ? updatedCustomer : cust))
            );
          }}
        />
      )}
    </div>
  );
}
