"use client"; // ✅ Required because useRouter() is a Client Component hook

import { useRouter } from "next/navigation";

const TenantDashboard = () => {
  const router = useRouter();
  const tenantId = localStorage.getItem("tenantId"); // Fetch tenantId inside the function

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tenant Dashboard: Yashus</h1>

      <div className="space-y-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => router.push(`/tenants/${tenantId}/customers`)}
        >
          Customers
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => router.push(`/tenants/${tenantId}/inventory`)}
        >
          Inventory
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          onClick={() => router.push(`/tenants/${tenantId}/taxation`)}
        >
          Taxation
        </button>
      </div>
    </div>
  );
};

export default TenantDashboard;
