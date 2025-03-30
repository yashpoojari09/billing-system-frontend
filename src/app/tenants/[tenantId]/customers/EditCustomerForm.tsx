"use client";

import { useState } from "react";
import { updateCustomer } from "@/utils/api";
import { EditCustomerFormProps } from "@/types";



export default function EditCustomerForm({ customer, onClose, onUpdate }: EditCustomerFormProps) {
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateCustomer(customer.id, formData);
      onUpdate({ ...customer, ...formData }); // Refresh the customer list
      onClose();
    } catch (error) {
      setError("Failed to update customer.");
      console.error("Error updating customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <label className="block mb-4">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
