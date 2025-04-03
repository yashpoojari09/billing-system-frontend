"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoiceForm from "./InvoiceForm";

const InvoicePage = () => {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId as string;

  // ✅ Check for accessToken on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // ❌ If no token, redirect to login
      router.push("/");
    }
  }, [router]);

  return <InvoiceForm tenantId={tenantId} />;
};

export default InvoicePage;
