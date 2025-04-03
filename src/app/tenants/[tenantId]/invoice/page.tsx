"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import InvoiceForm from "./InvoiceForm";

const InvoicePage = () => {
  const router = useRouter();

  // ✅ Check for accessToken on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // ❌ If no token, redirect to login
      router.push("/");
    }
  }, [router]);

  return <InvoiceForm />;
};

export default InvoicePage;
