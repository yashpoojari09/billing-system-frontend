// utils/pdfHandler.ts

import {API_URL} from "@/utils/api";
export const handleInvoicePDF = async (
  tenantId: string,
  receiptNumber: string,
  action: "view" | "download" | "both" = "both"
) => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_URL}/tenants/${tenantId}/receipt/${receiptNumber}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch PDF");

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);

    if (action === "view" || action === "both") {
      window.open(pdfUrl, "_blank");
    }

    if (action === "download" || action === "both") {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (err) {
    console.error("❌ Error handling invoice PDF:", err);
  }
};
