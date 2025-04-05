import { useEffect, useState } from "react";
import { CustomerInvoice, InvoiceItem, Product } from "@/types";
import { getInventory, createInvoice } from "@/utils/api";
import { CustomerSearch } from "@/components/InvoiceForm/CustomerSerch";
import { InvoiceItemList } from "@/components/InvoiceForm/InvoiceItemList";
import { InvoiceSummary } from "@/components/InvoiceForm/InvoiceSummary";
import { Button } from "@/components/ui/Button";

const InvoiceForm = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInvoice | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<InvoiceItem[]>([{ productId: "", quantity: 1, price: 0, totalPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getInventory().then(setProducts);
  }, []);

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }

    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const invoiceData = {
      name: selectedCustomer.name,
      email: selectedCustomer.email,
      phone: selectedCustomer.phone,
      products: items,
      totalAmount: total,
    };

    setSubmitting(true);
    try {
      const response = await createInvoice(invoiceData);
      if (response.success) {
        alert("Invoice generated!");
        setSelectedCustomer(null);
        setItems([{ productId: "", quantity: 1, price: 0, totalPrice: 0 }]);
      } else {
        alert("Failed to generate invoice.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-[#001e38]">Generate Invoice</h1>

      <CustomerSearch   selectedCustomer={selectedCustomer}
 onCustomerSelect={setSelectedCustomer} />

 

      <InvoiceItemList items={items} products={products} onItemsChange={setItems} />
      <InvoiceSummary items={items} />

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
