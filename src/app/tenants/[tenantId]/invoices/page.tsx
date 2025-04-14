"use client"
import React, { useEffect, useState } from 'react';
import { API_URL } from "@/utils/api";
import { FiDownload } from "react-icons/fi";
import { fetchInvoices, InvoiceListItem } from '@/utils/api'; // Adjust path

const PAGE_SIZE = 10;

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const totalPages = Math.ceil(totalInvoices / PAGE_SIZE);

  const tenantId = typeof window !== 'undefined' ? localStorage.getItem("tenantId") : "";

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);

        const data = await fetchInvoices(page, PAGE_SIZE);
        setInvoices(data.invoices);
        setTotalInvoices(data.total);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [page]);


  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <h1 className="text-2xl font-bold mb-6 text-center">Invoices</h1>
      <div className="bg-dark p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full">
      <div className="overflow-hidden rounded-lg border border-white">

        <table className="min-w-full border text-sm text-[#ffffff]">
          <thead className="bg-dark-100 text-left">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Receipt #</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-white">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length > 0 ? (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-800">
                  <td className="border p-2">{invoice.date}</td>
                  <td className="border p-2">{invoice.receiptNumber}</td>
                  <td className="border p-2">{invoice.customerName}</td>
                  <td className="border p-2">₹{invoice.amount}</td>
                  <td className="border p-2 text-center">
                    <a
                      href={`${API_URL}/tenants/${tenantId}/receipt/${invoice.receiptNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block hadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] text-white bg-transparent hover:text-blue-500 hover:text-blue-400"
                      title="Download Invoice"
                    >
                      <FiDownload size={22} />
                    </a>
                  </td>
                </tr>
              ))) : (<tr>
                <td colSpan={5} className="text-center p-4 text-white">
                  No invoices found.
                </td>
              </tr>)}
          </tbody>
        </table>
</div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-white">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
