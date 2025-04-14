"use client";

import { useState, useEffect, useCallback } from "react";
import { searchCustomerByEmail } from "@/utils/api";
import { CustomerInvoice } from "@/types/types";
import { Button } from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";
import AddCustomerForm from "@/app/tenants/[tenantId]/customers/AddCustomerForm"; // ✅ Import AddCustomerForm
interface Props {
  onCustomerSelect: (customer: CustomerInvoice | null) => void;
  selectedCustomer: CustomerInvoice | null;
}

export const CustomerSearch = ({ onCustomerSelect, selectedCustomer }: Props) => {
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState<CustomerInvoice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

 
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
  
    try {
      const result = await searchCustomerByEmail(email.trim().toLowerCase());
      if (result.length > 0) {
        setCustomers(result);
      } else {
        setCustomers(null);
        setError("No customers found.");
      }
    } catch {
      setError("Customer not found, please Add Customer.");
    } finally {
      setLoading(false);
    }
  }, [email]); // include email as dependency
  
  // Effect to trigger search when email length reaches 3 characters
  useEffect(() => {
    if (email.trim().length >= 3) {
      handleSearch();
    } else {
      setCustomers(null);
      setError(null);
    }
  }, [email, handleSearch]); // ✅ include handleSearch in dependencies
  

  const handleSelectCustomer = (customer: CustomerInvoice) => {
    setCustomers(null); // Hide list
    onCustomerSelect(customer); // Pass up to parent
  };

  const handleClearSelection = () => {
    onCustomerSelect(null); // Deselect customer
    setEmail(""); // Clear email input
    setCustomers(null); // Clear customer list
    setError(null); // Clear any errors
  };
  const handleCustomerAdded = (newCustomer: CustomerInvoice) => {
    setIsAddModalOpen(false);
    onCustomerSelect(newCustomer); // ✅ auto-select new customer
  };

  return (
    <div className="mb-4">
      {/* Show search input only if no customer is selected */}
      {!selectedCustomer ? (
        <>
          <div className="flex gap-2 text-[#ffffff]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Customer email or phone no"
              className="border rounded-md p-2 w-full text-[#ffffff]"
            />
          </div>

          {loading && <p className="text-white">Searching...</p>}
          {error && (
            <div className="text-red-500 mt-2 flex items-center justify-between">
              <p>{error}</p>
              <Button type="button" onClick={() => setIsAddModalOpen(true)}>
          <FiPlus className="h-5 w-5" />
              </Button>
            </div>
          )}
          {customers && (
            <div className="mt-2 bg-gray-100 p-2 rounded text-[#000000]">
              <h2>Select a Customer:</h2>
              {customers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => handleSelectCustomer(cust)}
                  className="cursor-pointer p-2 border-b hover:bg-gray-200"
                >
                  <p>
                    <strong>{cust.name}</strong> ({cust.email})
                  </p>
                  <p>{cust.phone}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="p-2 bg-green-950 rounded mt-2 text-[#fffffff]">
          <h2 className="font-semibold">Selected Customer:</h2>
          <p>
            <strong>{selectedCustomer.name}</strong>
          </p>
          <p>{selectedCustomer.email}</p>
          <p>{selectedCustomer.phone}</p>
          <br/>
          <Button type="button" onClick={handleClearSelection} className="mt-2">
            Clear Selection
          </Button>
        </div>
      )}
       {/* ✅ Display Add Customer Modal */}
            {isAddModalOpen && (
              <AddCustomerForm
                onClose={() => setIsAddModalOpen(false)}
                onCustomerAdded={handleCustomerAdded} // ✅ Pass function to update list
              />
            )}
    </div>
  );
};
