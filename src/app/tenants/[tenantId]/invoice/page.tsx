"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/utils/api";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { CustomerInvoice, InvoiceItem, Product } from "@/types"
import { getInventory, getCustomers } from "@/utils/api";


const InvoicePage = () => {
  const [customers, setCustomers] = useState<CustomerInvoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1 }]);

    const router = useRouter();
    const params = useParams();
    const tenantId = params?.tenantId;
  

  // ✅ Check for accessToken on page load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // ❌ If no token, redirect to login
      router.push("/");
    }
   

  }, [router]);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);


const fetchCustomers = async () => {
    try {

      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }

  };

   // ✅ Fetch inventory data
   const fetchProducts = async () => {
    try {
      const data = await getInventory();
      setProducts(data);

    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  
  };
  const handleProductChange = (index:number, productId:string) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index].productId = productId;
    setInvoiceItems(updatedItems);
  };

const handleQuantityChange = (index: number, quantity: string | number) => {
    const updatedItems: InvoiceItem[] = [...invoiceItems];
    updatedItems[index].quantity = Number(quantity);
    setInvoiceItems(updatedItems);
};

  const addItem = () => {
    setInvoiceItems([...invoiceItems, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index:number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const submitInvoice = async () => {
    try {
     await axios.post(`${API_URL}/tenants/${tenantId}/invoice`, {
        customerId: selectedCustomer,
        items: invoiceItems,
      });

      alert("Invoice generated successfully!");
    } catch (error) {
      alert("Error generating invoice.");
      console.error(error);
    }
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

      <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={submitInvoice}>
        Generate Invoice
      </button>
    </div>
  );
};

export default InvoicePage;
