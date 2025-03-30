"use client";

import { useState, useEffect } from "react";
import { getCustomers, deleteCustomer } from "@/utils/api";
// import { EditCustomerForm } from "/EditCustomerForm";

export default function CustomersTable() {
  const [customers, setCustomers] = useState<{ id: string; name: string; email: string }[]>([]);
  // const [editCustomer, setEditCustomer] = useState<{ id: string; name: string; email: string } | null>(null);

  // useEffect(() => {
  //   fetchCustomers();
  // }, []);

  const fetchCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
      fetchCustomers();
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
          {customers.map((customer) => (
            <tr key={customer.id} className="border text-[#001e38]">
              <td className="p-2 border">{customer.name}</td>
              <td className="p-2 border">{customer.email}</td>
              <td className="p-2 border">
                {/* <button onClick={() => setEditCustomer(customer)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                  Edit
                </button> */}
                <button onClick={() => handleDelete(customer.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* {editCustomer && <EditCustomerForm customer={editCustomer} onClose={() => setEditCustomer(null)} />} */}
    </div>
  );
}
