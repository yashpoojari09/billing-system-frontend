"use client";

import { useState, useEffect } from "react";
import { getCustomers, getInventory, createInvoice } from "@/utils/api";
import { CustomerInvoice, InvoiceItem, Product } from "@/types";
import { Button } from "@/components/ui/Button";


const InvoiceForm = () => {
  const [customers, setCustomers] = useState<CustomerInvoice[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerInvoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInvoice | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1 }]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredCustomers(
      customers.filter((customer) =>
        customer.email.toLowerCase().includes(searchEmail.toLowerCase())
      )
    );
  }, [searchEmail, customers]);

  const loadData = async () => {
    const customerData = await getCustomers();
    setCustomers(customerData);
    setFilteredCustomers(customerData);
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
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    const { name, email, phone } = selectedCustomer;

    const invoiceData = {
      name,
      email,
      phone,
      products: invoiceItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    const response = await createInvoice(invoiceData);
    if (response.success) {
      alert("Invoice generated successfully!");
    } else {
      alert("Error generating invoice.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-lg font-bold mb-4 text-[#001e38] text-center">Generate Invoice</h1>

      {/* 🔍 Search Customer by Email */}
      <input
        type="text"
        placeholder="Search by Email..."
        className="border p-2 w-full mb-2"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />

      <label className="block mb-2">Select Customer:</label>
      <select
        className="border p-2 w-full mb-4"
        value={selectedCustomer?.id || ""}
        onChange={(e) => {
          const customer = customers.find((c) => c.id === e.target.value) || null;
          setSelectedCustomer(customer);
        }}
      >
        <option value="">Select</option>
        {filteredCustomers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.email})
          </option>
        ))}
      </select>

      <h2 className="text-lg font-semibold mb-2">Invoice Items</h2>

      {invoiceItems.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <select
            className="border p-2 w-1/2"
            value={item.productId}
            onChange={(e) => handleProductChange(index, e.target.value)}
          >
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
          <Button type="submit"className="bg-red-500 text-white px-2 rounded" onClick={() => removeItem(index)}>
            ❌
          </Button>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addItem}>
          ➕ Add Item
        </Button>

        <Button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full" onClick={handleSubmit}>
          Generate Invoice
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
