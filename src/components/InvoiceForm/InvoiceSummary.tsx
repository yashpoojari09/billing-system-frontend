// components/InvoiceForm/InvoiceSummary.tsx
import { InvoiceItem } from "@/types/types";

interface Props {
  items: InvoiceItem[];
}

export const InvoiceSummary = ({ items }: Props) => {
  const taxTotal = items.reduce((sum, item) => sum + (item.taxAmount || 0), 0);
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-[#fffff]">
      <p>Tax: ₹{taxTotal.toFixed(2)}</p>
      <p>Total: ₹{total.toFixed(2)}</p>      </h3>
    </div>
  );
};
