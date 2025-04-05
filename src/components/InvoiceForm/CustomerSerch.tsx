"use client";

import { useState } from "react";
import { searchCustomerByEmail } from "@/utils/api";
import { CustomerInvoice } from "@/types/types";
import { Button } from "@/components/ui/Button";

interface Props {
  onCustomerSelect: (customer: CustomerInvoice) => void;
  selectedCustomer: CustomerInvoice | null;

}

export const CustomerSearch = ({ onCustomerSelect, selectedCustomer }: Props) => {
  const [email, setEmail] = useState("");
  const [customers, setCustomers] = useState<CustomerInvoice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }

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
      setError("Error searching for customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (customer: CustomerInvoice) => {
    setCustomers(null); // Hide list
    onCustomerSelect(customer); // Pass up to parent
  };

  return (
    <div className="mb-4">
      {/* Show search input only if no customer is selected */}
      {!selectedCustomer && (
        <>
          <div className="flex gap-2 text-[#001e38]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Customer Email"
              className="border p-2 w-full text-[#001e38]"
            />
            <Button type="button" onClick={handleSearch}>Search</Button>
          </div>

          {loading && <p className="text-gray-500">Searching...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {customers && (
            <div className="mt-2 bg-gray-100 p-2 rounded text-[#001e38]">
              <h2>Select a Customer:</h2>
              {customers.map((cust) => (
                <div
                  key={cust.id}
                  onClick={() => handleSelectCustomer(cust)}
                  className="cursor-pointer p-2 border-b hover:bg-gray-200"
                >
                  <p><strong>{cust.name}</strong> ({cust.email})</p>
                  <p>{cust.phone}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Only show selected customer once */}
      {selectedCustomer && (
        <div className="p-2 bg-green-100 rounded mt-2 text-[#001e38]">
          <h2 className="font-semibold">Selected Customer:</h2>
          <p><strong>{selectedCustomer.name}</strong></p>
          <p>{selectedCustomer.email}</p>
          <p>{selectedCustomer.phone}</p>
        </div>
      )}
    </div>
  );
};
