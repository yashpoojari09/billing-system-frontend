// components/InvoiceForm/InvoiceSummary.tsx
import { InvoiceItem } from "@/types";

interface Props {
  items: InvoiceItem[];
}

export const InvoiceSummary = ({ items }: Props) => {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-[#001e38]">
        Total: ${total.toFixed(2)}
      </h3>
    </div>
  );
};
