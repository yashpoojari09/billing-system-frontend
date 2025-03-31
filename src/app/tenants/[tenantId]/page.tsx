"use client"; // ✅ Required because useRouter() is a Client Component hook

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {Button} from "@/components/ui/Button"

const TenantDashboard = () => {
  const router = useRouter();
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Load tenantId from localStorage on mount
  useEffect(() => {
    setTenantId(localStorage.getItem("tenantId"));
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("tenantId"); // ✅ Clear tenant ID
    localStorage.removeItem("accessToken"); // ✅ Clear authentication token
    router.push("/auth/login"); // ✅ Redirect to login
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Tenant Dashboard: Yashus</h1>

      <div className="space-y-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => router.push(`/tenants/${tenantId}/customers`)}
          disabled={!tenantId}
        >
          Customers
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          onClick={() => router.push(`/tenants/${tenantId}/inventory`)}
          disabled={!tenantId}
        >
          Inventory
        </button>
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded w-full"
          onClick={() => router.push(`/tenants/${tenantId}/taxation`)}
          disabled={!tenantId}
        >
          Taxation
        </button>
      </div>

      {/* Logout Button */}
      <div className="justify-right mt-6">
        <Button type="button"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default TenantDashboard;
