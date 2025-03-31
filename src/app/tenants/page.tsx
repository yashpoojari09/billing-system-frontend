"use client";

import { useRouter } from "next/navigation";

export default function TenantDashboard({ params }: { params: { tenantId: string } }) {
  const router = useRouter();
  const { tenantId } = params;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome to Yashus</h1>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => router.push(`/tenants/${tenantId}/customers`)}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Manage Customers
          </button>

          <button 
            onClick={() => router.push(`/tenants/${tenantId}/inventory`)}
            className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            Manage Inventory
          </button>

          <button 
            onClick={() => router.push(`/tenants/${tenantId}/taxation`)}
            className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Manage Taxation
          </button>
        </div>
      </div>
    </div>
  );
}
