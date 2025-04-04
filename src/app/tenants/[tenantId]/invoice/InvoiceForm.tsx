"use client";

import { useState, useEffect } from "react";
import { searchCustomerByEmail, getInventory, createInvoice } from "@/utils/api";
import { InvoiceItem, Product, CustomerInvoice } from "@/types";
import { Button } from "@/components/ui/Button";

const InvoiceForm = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [customers, setCustomers] = useState<CustomerInvoice[] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const inventory = await getInventory();
      setProducts(inventory);
    } catch (error) {
      console.error("Error loading inventory:", error);
      setError("Failed to load inventory. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const foundCustomers = await searchCustomerByEmail(searchEmail.trim().toLowerCase());
      console.log("Setting customers state:", foundCustomers); // ✅ Debugging state update

      if (foundCustomers) {
        setCustomers(foundCustomers);
      } else {
        setError("Customer not found. A new customers will be created.");
      }
    } catch (error) {
      setError("Error fetching customers. Please try again.");
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], productId };
    setInvoiceItems(updatedItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], quantity: Number(quantity) };
    setInvoiceItems(updatedItems);
  };

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!searchEmail || !customers) {
      alert("Please enter a valid email and find the customers before generating an invoice.");
      return;
    }

    if (invoiceItems.some((item) => !item.productId)) {
      alert("Please select a product for all invoice items.");
      return;
    }

    setSubmitting(true);

    try {
      const invoiceData = {
        name: customers[0].name,
        email: customers[0].email,
        phone: customers[0].phone,
        products: invoiceItems,
      };

      const response = await createInvoice(invoiceData);
      if (response.success) {
        alert("Invoice generated successfully!");
        setInvoiceItems([{ productId: "", quantity: 1 }]);
      } else {
        alert("Error generating invoice.");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
      alert("Error generating invoice.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-[#001e38]">Generate Invoice</h1>

      {/* 🔍 Search Customer by Email */}
      <div className="flex gap-2">
        <input
          name="email"
          type="email"
          placeholder="Enter Customer Email..."
          className="border p-2 w-full mb-2 text-[#001e38]"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <Button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {loading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {customers && customers.map((customer, i)=>(
        <div key={i} className="p-2 border rounded bg-gray-100 ">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
        </div>
      )) }

      <h2 className="text-lg font-semibold mt-4 mb-2 text-[#001e38]">Invoice Items</h2>

      {invoiceItems.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2 text-[#001e38]">
          <select
            className="border p-2 w-1/2 text-[#001e38]"
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
            name="quantity"
            type="number"
            className="border p-2 w-1/4"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
            min="1"
          />
          <Button type="button" className="bg-red-500 text-white px-2 rounded" onClick={() => removeItem(index)}>
            ❌
          </Button>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <Button type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addItem}>
          ➕ Add Item
        </Button>

        <Button
          type="button"
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Generating..." : "Generate Invoice"}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
