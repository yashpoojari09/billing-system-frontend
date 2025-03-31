"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {API_URL} from "@/utils/api"
import {FormData} from "@/types"

export default function EditCustomerPage() {
  const router = useRouter();

  const params = useParams();
  const customerId = params?.customerId as string;
  const tenantId = localStorage.getItem("tenantId"); // Fetch tenantId inside the function

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch customer details when the page loads
  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await axios.get(
          `${API_URL}/tenants/${tenantId}/customers/${customerId}`
        );
        setFormData({ name: response.data.name, email: response.data.email });
      } catch  {
        setError("Failed to fetch customer details.");
      }
    }
    fetchCustomer();
  }, [customerId]);

  // ✅ Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/tenants/${tenantId}/customers/${customerId}`, formData as FormData);
      router.push(`/tenants/${tenantId}/customers`); // ✅ Redirect back
    } catch  {
      setError("Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded">
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
          <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
