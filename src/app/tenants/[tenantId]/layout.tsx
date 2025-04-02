"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-gray-900 text-white p-5 z-30 transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-72 md:translate-x-0"}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Tenant Dashboard</h2>
          <button
            className="text-white md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <ul className="space-y-3">
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/customers`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer ${
                pathname?.includes("customers") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Customers
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/inventory`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer ${
                pathname?.includes("inventory") ? "bg-green-600" : "hover:bg-gray-700"
              }`}
            >
              Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/taxation`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer ${
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
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <div className="bg-white shadow-md p-4 flex justify-between items-center md:pl-72">
          <button
            className="text-gray-700 md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-xl font-semibold">Tenant Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};

export default TenantLayout;