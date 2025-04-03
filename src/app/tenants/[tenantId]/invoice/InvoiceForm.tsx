"use client";

import { useState, useEffect } from "react";
import { getCustomers, getInventory, submitInvoice } from "@/utils/api";
import { CustomerInvoice, InvoiceItem, Product } from "@/types";

interface InvoiceFormProps {
  tenantId: string;
}

const InvoiceForm = ({ tenantId }: InvoiceFormProps) => {
  const [customers, setCustomers] = useState<CustomerInvoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1 }]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setCustomers(await getCustomers());
    setProducts(await getInventory());
  };

  const handleProductChange = (index: number, productId: string) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].productId = productId;
    setInvoiceItems(updatedItems);
  };

  const handleQuantityChange = (index: number, quantity: string | number) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].quantity = Number(quantity);
    setInvoiceItems(updatedItems);
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const result = await submitInvoice(tenantId, selectedCustomer, invoiceItems);
    alert(result.success ? "Invoice generated successfully!" : "Error generating invoice.");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Generate Invoice</h1>

      <label className="block mb-2">Select Customer:</label>
      <select className="border p-2 w-full mb-4" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
        <option value="">Select</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.email})
          </option>
        ))}
      </select>

      <h2 className="text-lg font-semibold mb-2">Invoice Items</h2>

      {invoiceItems.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <select className="border p-2 w-1/2" value={item.productId} onChange={(e) => handleProductChange(index, e.target.value)}>
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="border p-2 w-1/4"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            min="1"
          />
          <button className="bg-red-500 text-white px-2 rounded" onClick={() => removeItem(index)}>
            ❌
          </button>
        </div>
      ))}

      <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={addItem}>
        ➕ Add Item
      </button>

      <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={handleSubmit}>
        Generate Invoice
      </button>
    </div>
  );
};

export default InvoiceForm;
