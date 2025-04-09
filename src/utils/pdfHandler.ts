// utils/pdfHandler.ts

import api, { API_URL } from "@/utils/api";
import axios from "axios";

export const handleInvoicePDF = async (
  tenantId: string,
  receiptNumber: string,
  mode: "download" | "view" | "both" = "view"
) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/tenants/${tenantId}/receipt/${receiptNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // 👈 required to handle PDF correctly
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const blobUrl = window.URL.createObjectURL(blob);

    if (mode === "download" || mode === "both") {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `invoice-${receiptNumber}.pdf`;
      link.click();
    }

    if (mode === "view" || mode === "both") {
      window.open(blobUrl, "_blank");
    }
  } catch (err) {
    console.error("❌ Error downloading or viewing PDF:", err);
    alert("Failed to open invoice PDF.");
  }
};
