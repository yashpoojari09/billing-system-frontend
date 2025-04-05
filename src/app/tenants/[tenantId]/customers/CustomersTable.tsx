"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/utils/api";
// import EditCustomerForm from "./[customerId]/EditCustomerForm";
import { CustomersTableProps } from "@/types/types";
import { ButtonEd } from "@/components/ui/Button";


export default function CustomersTable({ customers, setCustomers, isLoading }: CustomersTableProps) {
  // const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  // const [editCustomerId, setEditCustomerId] = useState<string | null>(null);
  
  const tenantId = localStorage.getItem("tenantId"); // Fetch tenantId inside the function
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
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-[#000000] text-center">Customers List</h2>

      <div className="overflow-x-auto">
      {isLoading ? ( // ✅ Show loading while fetching
        <div className="text-center text-gray-600">Loading customers...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 min-w-[350px]">
          <thead>
            <tr className="bg-gray-200 text-[#000000]">
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Phone</th>

              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer.id} className="text-center text-[#000000]">
                  <td className="p-2 border">{customer.name}</td>
                  <td className="p-2 border">{customer.email}</td>
                  <td className="p-2 border">{customer.phone}</td>

                  <td className="p-2 border  justify-center gap-2">
                    {/* setEditCustomerId(customer.id) */}
                    <ButtonEd
                      onClick={() => {
                        router.push(`/tenants/${tenantId}/customers/${customer.id}/edit`); // ✅ Navigate
                      }}
                      variant="edit"
                      className="w-full sm:w-auto"
                    >
                      Edit
                    </ButtonEd>
                    <ButtonEd
                      onClick={() => handleDelete(customer.id)}
                      variant="delete"
                      className="w-full sm:w-auto"
                    >
                      Delete
                    </ButtonEd>
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
      )}
      </div>

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
