"use client"
import React, { useEffect, useState } from 'react';
import { fetchInvoices, InvoiceListItem } from '@/utils/api'; // Adjust path

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  if (loading) return <p className="p-4">Loading invoices...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-[#001e38]">Invoices</h2>
      <table className="min-w-full border text-sm text-[#001e38]">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border p-2">Date</th>
            <th className="border p-2">Receipt #</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="border p-2">{invoice.date}</td>
              <td className="border p-2">{invoice.receiptNumber}</td>
              <td className="border p-2">{invoice.customerName}</td>
              <td className="border p-2">₹{invoice.amount}</td>
              <td className="border p-2">
                <a
                  href={invoice.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download PDF
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
