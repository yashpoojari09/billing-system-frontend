"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FiMenu } from "react-icons/fi"; // Import Hamburger icon

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

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

  // ✅ Function to handle menu click and close sidebar
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSidebarOpen(false); // Close sidebar after clicking
  };

  return (
    <div className="relative flex min-h-screen">
      {/* ✅ Overlay (closes sidebar when clicked) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Close sidebar when clicking outside
        />
      )}

      {/* ✅ Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5 transition-transform duration-300 z-20 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:w-64 md:static`}
      >
        <h2 className="text-lg font-bold mb-6">Tenant Dashboard</h2>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/customers`)}
              className={`w-full text-left px-4 py-2 block rounded ${
                pathname?.includes("customers") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Customers
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/inventory`)}
              className={`w-full text-left px-4 py-2 block rounded ${
                pathname?.includes("inventory") ? "bg-green-600" : "hover:bg-gray-700"
              }`}
            >
              Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/taxation`)}
              className={`w-full text-left px-4 py-2 block rounded ${
                pathname?.includes("taxation") ? "bg-yellow-600" : "hover:bg-gray-700"
              }`}
            >
              Taxation
            </button>
          </li>
        </ul>

        {/* ✅ Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Hamburger Button */}
      <button
        className="absolute top-4 left-4 text-white md:hidden bg-gray-900 p-2 rounded z-30"
        onClick={(e) => {
          e.stopPropagation(); // Prevents click from bubbling to overlay
          setIsSidebarOpen(!isSidebarOpen);
        }}
      >
        <FiMenu size={24} />
      </button>

      {/* ✅ Main Content */}
      <div className="flex-1 p-6 ml-0 md:ml-64">{children}</div>
    </div>
  );
};

export default TenantLayout;
