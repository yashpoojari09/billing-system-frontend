// utils/pdfHandler.ts

import api, { API_URL } from "@/utils/api";
import { getAuthHeaders } from "@/utils/api";

export const handleInvoicePDF = async (
  tenantId: string,
  receiptNumber: string,
  action = 'both' // 'view', 'download', or 'both'
) => {
  try {
    console.log('📥 Fetching invoice PDF:', { tenantId, receiptNumber, action });

    if (!tenantId || !receiptNumber) {
      throw new Error('Tenant ID and Receipt Number are required.');
    }

    let response;
    try {
      response = await api.get(
        `${API_URL}/tenants/${tenantId}/receipt/${receiptNumber}`,
        {
          headers: {
            ...getAuthHeaders(),
          },
          responseType: 'blob', // Important for handling binary data
        }
      );
    } catch (apiError) {
      console.error('❌ API request failed:', apiError);
      throw new Error('Failed to fetch invoice PDF from the API.');
    }

    if (!response || response.status !== 200) {
      console.error('❌ Invalid response:', response);
      throw new Error(`Failed to fetch invoice PDF. Status: ${response?.status}`);
    }

    let blob;
    try {
      blob = new Blob([response.data], { type: 'application/pdf' });
    } catch (blobError) {
      console.error('❌ Error creating Blob:', blobError);
      throw new Error('Failed to create Blob from response data.');
    }

    let pdfUrl;
    try {
      pdfUrl = URL.createObjectURL(blob);
    } catch (urlError) {
      console.error('❌ Error creating Object URL:', urlError);
      throw new Error('Failed to create Object URL for the PDF.');
    }

    if (action === 'view' || action === 'both') {
      try {
        window.open(pdfUrl, '_blank');
      } catch (viewError) {
        console.error('❌ Error opening PDF in new tab:', viewError);
        throw new Error('Failed to open PDF in a new tab.');
      }
    }

    if (action === 'download' || action === 'both') {
      try {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfUrl);
      } catch (downloadError) {
        console.error('❌ Error downloading PDF:', downloadError);
        throw new Error('Failed to download the PDF.');
      }
    }
  } catch (err) {
    console.error('❌ Error handling invoice PDF:', err);
  }
};