"use client"; 

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setTenantId(localStorage.getItem("tenantId"));

    if (!token) {
      router.push("/");
    }

    // ✅ Redirect to Customers page by default
    if (pathname === `/tenants/${tenantId}` && tenantId) {
      router.push(`/tenants/${tenantId}/customers`);
    }
  }, [router, pathname, tenantId]);

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
