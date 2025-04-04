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
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInvoice | null>(null);

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

      if (foundCustomers && foundCustomers.length > 0) {
        setCustomers(foundCustomers);
        setSelectedCustomer(null); // Reset selected customer if a new search is made
      } else {
        setCustomers([]);
        setError("No customer found. You may need to create a new one.");
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

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer before generating an invoice.");
      return;
    }

    if (invoiceItems.some((item) => !item.productId)) {
      alert("Please select a product for all invoice items.");
      return;
    }

    setSubmitting(true);

    try {
      const invoiceData = {
        name: selectedCustomer.name,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
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

      {/* Customers List */}
      {customers && customers.length > 0 && (
        <div className="grid gap-2">
          {customers.map((customer, i) => (
            <div
              key={i}
              className={`p-2 border rounded cursor-pointer ${
                selectedCustomer?.id === customer.id ? "bg-blue-200 border-blue-500" : "bg-gray-100"
              }`}
              onClick={() => setSelectedCustomer(customer)}
            >
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
            </div>
          ))}
        </div>
      )}

      {/* Display Selected Customer */}
      {selectedCustomer && (
        <div className="mt-4 p-4 border rounded bg-green-100">
          <h3 className="text-md font-bold">Selected Customer:</h3>
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          <p><strong>Email:</strong> {selectedCustomer.email}</p>
          <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
        </div>
      )}

      {/* Invoice Items */}
      <h2 className="text-lg font-semibold mt-4 mb-2 text-[#001e38]">Invoice Items</h2>
      {invoiceItems.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2 text-[#001e38]">
          <select className="border p-2 w-1/2" value={item.productId} onChange={(e) => handleProductChange(index, e.target.value)}>
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>{product.name} - ${product.price}</option>
            ))}
          </select>
          <input name="quantity" type="number" className="border p-2 w-1/4" value={item.quantity} onChange={(e) => handleQuantityChange(index, Number(e.target.value))} min="1" />
          <Button type="button" className="bg-red-500 text-white px-2 rounded" onClick={() => removeItem(index)}>❌</Button>
        </div>
      ))}

      {/* Total & Submit */}
      <p className="font-semibold text-lg mt-2">Total: ${calculateTotal()}</p>

      <Button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4" onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Generating..." : "Generate Invoice"}
      </Button>
    </div>
  );
};

export default InvoiceForm;
