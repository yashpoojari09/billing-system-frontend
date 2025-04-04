"use client";

import { useState, useEffect } from "react";
import { searchCustomerByEmail , getInventory, createInvoice } from "@/utils/api";
import { InvoiceItem, Product, CustomerInvoice } from "@/types";
import { Button } from "@/components/ui/Button";

const InvoiceForm = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [customer, setCustomer] = useState<CustomerInvoice | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setProducts(await getInventory());
  };

  const handleEmailChange = async (email: string) => {
    setSearchEmail(email);

    if (email.length > 3) {
      setLoading(true);
      const foundCustomer = await searchCustomerByEmail(email);
      setCustomer(foundCustomer);
      setLoading(false);
    }
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
    if (!searchEmail || !customer) {
      alert("Please enter a valid email to find or create a customer.");
      return;
    }

    const invoiceData = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
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
      <h1 className="text-xl font-bold mb-4 text-[#001e38] ">Generate Invoice</h1>

      {/* 🔍 Search Customer by Email */}
      <input
        type="email"
        placeholder="Enter Customer Email..."
        className="border p-2 w-full mb-2 text-[#001e38] "
        value={searchEmail}
        onChange={(e) => handleEmailChange(e.target.value)}
      />

      {loading && <p className="text-gray-500">Searching...</p>}

      {customer ? (
        <div className="p-2 border rounded bg-gray-100 text-[#001e38] ">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
        </div>
      ) : (
        searchEmail && !loading && (
          <p className="text-red-500">Customer not found. A new customer will be created.</p>
        )
      )}

      <h2 className="text-lg font-semibold mt-4 mb-2 text-[#001e38] ">Invoice Items</h2>

      {invoiceItems.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2 text-[#001e38] ">
          <select
            className="border p-2 w-1/2 text-[#001e38] "
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
          <Button type="submit" className="bg-red-500 text-white px-2 rounded" onClick={() => removeItem(index)}>
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
