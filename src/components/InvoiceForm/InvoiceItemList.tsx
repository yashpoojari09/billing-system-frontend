// components/InvoiceForm/InvoiceItemList.tsx
"use client";

import { InvoiceItem, Product } from "@/types";
import { Button } from "@/components/ui/Button";

interface Props {
  items: InvoiceItem[];
  products: Product[];
  onItemsChange: (updated: InvoiceItem[]) => void;
}

export const InvoiceItemList = ({ items, products, onItemsChange }: Props) => {
  const handleProductChange = (index: number, productId: string) => {
    const updated = [...items];
    const product = products.find(p => p.id === productId);
    if (product) {
      updated[index] = {
        ...updated[index],
        productId,
        price: product.price,
        totalPrice: product.price * updated[index].quantity,
      };
    }
    onItemsChange(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      quantity: qty,
      totalPrice: updated[index].price * qty,
    };
    onItemsChange(updated);
  };

  const addItem = () => {
    onItemsChange([...items, { productId: "", quantity: 1, price: 0, totalPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onItemsChange(updated);
  };

  return (
    <>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2 text-[#001e38]">
          <select
            className="border p-2 w-1/2"
            value={item.productId}
            onChange={(e) => handleProductChange(index, e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - ${p.price}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={item.quantity}
            className="border p-2 w-1/4"
            min={1}
            onChange={(e) => handleQtyChange(index, Number(e.target.value))}
          />
          <span className="p-2 w-1/4 text-right">${item.totalPrice.toFixed(2)}</span>
          <Button type="submit" onClick={() => removeItem(index)} className="bg-red-500 text-white">❌</Button>
        </div>
      ))}
      <Button type="submit" onClick={addItem} className="bg-blue-500 text-white mt-2">+</Button>
    </>
  );
};
