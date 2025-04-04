"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { FormData } from "@/types";
import { getAuthHeaders } from "@/utils/api";
import { ButtonDash } from "@/components/ui/Button";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.customerId as string;
  const tenantId = typeof window !== "undefined" ? localStorage.getItem("tenantId") : null; // Ensure localStorage is accessed on client-side

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const response = await axios.get(
          `${API_URL}/tenants/${tenantId}/customers/${customerId}`,
          { headers: getAuthHeaders() }
        );
        setFormData({ name: response.data.name,
           email: response.data.email, 
           phone: response.data.phone });
      } catch {
        setError("Failed to fetch customer details.");
      }
    }
    fetchCustomer();
  }, [customerId, tenantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/tenants/${tenantId}/customers/${customerId}`,
        formData as FormData,
        { headers: getAuthHeaders() }
      );
      router.push(`/tenants/${tenantId}/customers`);
    } catch {
      setError("Failed to update customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Edit Customer</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <ButtonDash
              title="Cancel"
              variant="blue"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
            >
              Cancel
            </ButtonDash>
            <ButtonDash
              title={loading ? "Updating..." : "Save Changes"}
              variant="green"
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              disabled={loading}
            >
              
            </ButtonDash>
          </div>
        </form>
      </div>
    </div>
  );
}
