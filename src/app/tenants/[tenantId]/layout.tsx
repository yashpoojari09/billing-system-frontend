"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { FiMenu } from "react-icons/fi";


const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  // ✅ Close sidebar when clicking outside (for mobile & desktop)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div className="relative flex min-h-screen">
      {/* ✅ Sidebar (Mobile & Desktop) */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-5 transition-transform duration-300 z-30 md:relative ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"
        }`}
      >
        <h2 className="text-lg font-bold mb-6">Tenant Dashboard</h2>
        <ul className="space-y-3">
           <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/invoice`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer ${
                pathname?.includes("invoice") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Invoice
            </button>
          </li>
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
                pathname?.includes("inventory") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Inventory
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation(`/tenants/${tenantId}/taxation`)}
              className={`w-full text-left px-4 py-2 block rounded cursor-pointer ${
                pathname?.includes("taxation") ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Taxation
            </button>
          </li>
         
        </ul>

        <div className="mt-100">
          <button
            onClick={handleLogout}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white  px-4 py-2 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ✅ Sticky Header (Navigation & Logout) */}
      <div className="fixed w-full bg-gray-900 text-white p-4 flex justify-between items-center z-40 md:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="text-white">
          <FiMenu size={24} />
        </button>
        <h2 className="text-lg font-bold">Tenant Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
          Logout
        </button>
      </div>

      {/* ✅ Main Content (With Padding for Header) */}
      <div className="flex-1 p-6 mt-16">{children}</div>
    </div>
  );
};

export default TenantLayout;
