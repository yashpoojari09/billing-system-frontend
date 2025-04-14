"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/utils/api";
// import EditCustomerForm from "./[customerId]/EditCustomerForm";  const PAGE_SIZE = 10;

import { CustomersTableProps } from "@/types/types";
import { ButtonEd } from "@/components/ui/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function CustomersTable({ customers, setCustomers, isLoading }: CustomersTableProps) {
  // const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  // const [editCustomerId, setEditCustomerId] = useState<string | null>(null);


  const router = useRouter();

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

    <div className="overflow-x-auto">
      {isLoading ? ( // ✅ Show loading while fetching
        <div className="text-center text-white">Loading customers...</div>
      ) : (
        <table className="w-full  border-collapse border border-black min-w-[350px]">
          <thead>
            <tr className="bg-dark text-[#ffffff]">
              <th className="border p-2 text-centre">Name</th>
              <th className="border p-2 text-centre">Email</th>
              <th className="border p-2 text-centre">Phone</th>

              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="text-center text-[#ffffff]">
                  <td className="p-2 border">{customer.name}</td>
                  <td className="p-2 border">{customer.email}</td>
                  <td className="p-2 border">{customer.phone}</td>

                  <td className="p-2 border  justify-center gap-2">
                    {/* setEditCustomerId(customer.id) */}
                    <ButtonEd
                      onClick={() => {
                        const tenantId = localStorage.getItem("tenantId"); // Fetch tenantId inside the function

                        router.push(`/tenants/${tenantId}/customers/${customer.id}/edit`); // ✅ Navigate
                      }}
                      variant="edit"
                      className="w-full sm:w-auto"
                    >
                      <FiEdit className="h-4 w-4" />

                    </ButtonEd>
                    <ButtonEd
                      onClick={() => handleDelete(customer.id)}
                      variant="delete"
                      className="w-full sm:w-auto"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </ButtonEd>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      
      )}

      {/* ✅ Show EditCustomerForm */}
      {/* {editCustomerId && (
        <EditCustomerForm
          customer={customers.find((customer) => customer.id === editCustomerId)!}
          onClose={() => setEditCustomerId(null)}
          onUpdate={(onCustomerUpdated) => {
            setCustomers((prev) =>
              prev.map((customer) => (customer.id === onCustomerUpdated.id ? onCustomerUpdated : customer))
            );
          }
        }
        />
      )} */}
    </div>
  );
}
