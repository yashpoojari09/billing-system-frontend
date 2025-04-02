"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FiMenu } from "react-icons/fi";

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("tenantId");
    localStorage.removeItem("accessToken");
    router.push("/auth/login");
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedTenantId = localStorage.getItem("tenantId");

    if (!token) {
      handleLogout();
      return;
    }

    if (storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, [handleLogout]);

  useEffect(() => {
    if (tenantId && pathname === `/tenants/${tenantId}`) {
      router.push(`/tenants/${tenantId}/customers`);
    }
  }, [tenantId, pathname, router]);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5 transition-transform duration-300 z-30 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:w-64 md:static`}
      >
        <h2 className="text-lg font-bold mb-6">Tenant Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/customers`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer 
                ${pathname?.includes("customers") ? "bg-blue-600" : "hover:bg-gray-700"}`}
            >
              Customers
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/inventory`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer 
                ${pathname?.includes("inventory") ? "bg-green-600" : "hover:bg-gray-700"}`}
            >
              Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/taxation`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer 
                ${pathname?.includes("taxation") ? "bg-yellow-600" : "hover:bg-gray-700"}`}
            >
              Taxation
            </button>
          </li>
        </ul>
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content with Top Navigation */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between md:px-6">
          <button
            className="text-gray-900 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-semibold">Tenant Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default TenantLayout;