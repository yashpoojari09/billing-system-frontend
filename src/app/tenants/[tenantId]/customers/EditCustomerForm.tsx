"use client";

import { useState, useEffect } from "react";
import { updateCustomer, getCustomerById } from "@/utils/api";
import { EditCustomerFormProps } from "@/types";

export default function EditCustomerForm({ customerId, onClose, onUpdate }: EditCustomerFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer details when component mounts
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const data = await getCustomerById(customerId);
        setFormData({ name: data.name, email: data.email });
      } catch (err) {
        setError("Failed to fetch customer details.");
      }
    }
    fetchCustomer();
  }, [customerId]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedCustomer = await updateCustomer(customerId, formData);
      onUpdate(updatedCustomer); // ✅ Update UI
      onClose(); // ✅ Close modal
    } catch (err) {
      setError("Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
