import { useEffect, useState } from "react";
import { CustomerInvoice, InvoiceItem, Product } from "@/types/types";
import { getInventory, createInvoice } from "@/utils/api";
import { CustomerSearch } from "@/components/InvoiceForm/CustomerSerch";
import { InvoiceItemList } from "@/components/InvoiceForm/InvoiceItemList";
import { InvoiceSummary } from "@/components/InvoiceForm/InvoiceSummary";
import { Button } from "@/components/ui/Button";
import { handleInvoicePDF } from "@/utils/pdfHandler";

const InvoiceForm = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInvoice | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1, price: 0, totalPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getInventory().then(setProducts);
  }, []);


      // 🧠 Enrich each item with tax rate and tax amount
      const enrichedItems = items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const taxRate = product?.tax?.taxRate || 0;
    
        const basePrice = item.price * item.quantity;
        const taxAmount = basePrice * taxRate;
        const totalPrice = basePrice + taxAmount;
    
        return {
          ...item,
          taxRate,
          taxAmount,
          totalPrice,
        };
      });
    
      const total = enrichedItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    const invoiceData = {
      name: selectedCustomer.name,
      email: selectedCustomer.email,
      phone: selectedCustomer.phone,
      products: enrichedItems,
      totalAmount: total,

    };

    setSubmitting(true);
    try {
      const response = await createInvoice(invoiceData);

      if (response.success) {
        const { receiptNumber } = response.data;
        const tenantId = localStorage.getItem("tenantId");

        if (tenantId && receiptNumber) {
          await handleInvoicePDF(tenantId, receiptNumber, "both"); // or "view", "download"
        }
        alert("Invoice generated!");
        setSelectedCustomer(null);
        setItems([{ productId: "", quantity: 1, price: 0, totalPrice: 0 }]);
        // setItems([{ productId: "", quantity: 1, price: 0, totalPrice: 0 }]);
      } else {
        const errorMsg = response.error || "Failed to generate invoice.";
        alert(`❌ ${errorMsg}`);
        console.error("Invoice creation error:", errorMsg);
      
      }
    }catch (err: any) {
      console.error("❌ Unexpected error in handleSubmit:", err);
      alert("An unexpected error occurred while submitting the invoice. Please try again.");
    } 
     finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-[#001e38]">Generate Invoice</h1>

      <CustomerSearch   selectedCustomer={selectedCustomer}
 onCustomerSelect={setSelectedCustomer} />

 

      <InvoiceItemList items={items} products={products} onItemsChange={setItems} />
      <InvoiceSummary items={enrichedItems} />

      <Button type="submit"
        onClick={handleSubmit}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
        disabled={submitting}
      >
        {submitting ? "Generating..." : "Generate Invoice"}
      </Button>
    </div>
  );
};

export default InvoiceForm;
