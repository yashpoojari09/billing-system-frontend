"use client"; 

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tenantId, setTenantId] = useState<string | null>(null);
   

  // ✅ Memoize handleLogout function to avoid unnecessary re-renders
  const handleLogout = useCallback(() => {
    localStorage.removeItem("tenantId");
    localStorage.removeItem("accessToken");
    router.push("/auth/login");
  }, [router]);

  // ✅ Fetch `tenantId` on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedTenantId = localStorage.getItem("tenantId");

    if (!token) {
      handleLogout(); // ⬅️ Force logout if token is missing
      return;
    }

    if (storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [handleLogout]);

// ✅ Redirect to `/customers` only after `tenantId` is available
useEffect(() => {
  if (tenantId && pathname === `/tenants/${tenantId}`) {
    router.push(`/tenants/${tenantId}/customers`);
  }
}, [tenantId, pathname, router]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 fixed h-full">
        <h2 className="text-lg font-bold mb-6">Tenant Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => router.push(`/tenants/${tenantId}/customers`)}
              className={`w-full text-left px-4 py-2 block rounded ${
                pathname?.includes("customers") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Customers
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push(`/tenants/${tenantId}/inventory`)}
              className={`w-full text-left px-4 py-2 block rounded ${
                pathname?.includes("inventory") ? "bg-green-600" : "hover:bg-gray-700"
              }`}
            >
              Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push(`/tenants/${tenantId}/taxation`)}
              className={`w-full text-left px-4 py-2 block rounded ${
                pathname?.includes("taxation") ? "bg-yellow-600" : "hover:bg-gray-700"
              }`}
            >
              Taxation
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              localStorage.removeItem("tenantId");
              localStorage.removeItem("accessToken");
              router.push("/auth/login");
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">{children}</div>
    </div>
  );
};

export default TenantLayout;
