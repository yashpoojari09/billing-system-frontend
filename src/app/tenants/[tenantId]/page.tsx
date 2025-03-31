"use client"; // ✅ Required because useRouter() is a Client Component hook

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonDash } from "@/components/ui/Button"

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
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Tenant Dashboard: Yashus</h1>

      <div className="space-y-4 sm:space-y-6">
        <ButtonDash title="Customers" variant="blue" navigateTo={`/tenants/${tenantId}/customers`} disabled={!tenantId} />
        <ButtonDash title="Inventory" variant="green" navigateTo={`/tenants/${tenantId}/inventory`} disabled={!tenantId} />
        <ButtonDash title="Taxation" variant="yellow" navigateTo={`/tenants/${tenantId}/taxation`} disabled={!tenantId} />
      </div>

      {/* Logout Button */}
      <div className="flex justify-center sm:justify-start mt-6">
        <Button type="button" onClick={handleLogout} className="w-full sm:w-auto">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default TenantDashboard;
