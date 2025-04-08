"use client";

import { InvoiceItem, Product } from "@/types/types";
import { Button } from "@/components/ui/Button";
import { FiTrash } from "react-icons/fi";

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
      const taxRate = product.tax?.taxRate || 0;
      const quantity = updated[index].quantity || 1;
      const price = product.price;
      const totalPrice = price * quantity;

      updated[index] = {
        ...updated[index],
        productId,
        price,
        quantity,
        taxRate,
        totalPrice,
      };
    }
    onItemsChange(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...items];
    const product = products.find(p => p.id === updated[index].productId);
    if (product) {
      const price = product.price;
      const totalPrice = price * qty;

      updated[index] = {
        ...updated[index],
        quantity: qty,
        totalPrice,
      };
      onItemsChange(updated);
    }
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
      {items.map((item, index) => {
        const product = products.find(p => p.id === item.productId);
        const taxRate = product?.tax?.taxRate ? (product.tax.taxRate * 100).toFixed(2) : "0";

        return (
          <div key={index} className="flex flex-col gap-1 mb-4 border p-3 rounded text-[#001e38] bg-white">
            <div className="flex gap-2 items-center">
              <select
                className="border p-2 w-1/2"
                value={item.productId}
                onChange={(e) => handleProductChange(index, e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ₹{p.price}
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

              <span className="p-2 w-1/4 text-right">₹{item.totalPrice.toFixed(2)}</span>

              <Button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-red-500 text-white"
              >
                  <FiTrash className="w-5 h-5" />

              </Button>
            </div>

            <div className="text-sm text-gray-500 pl-1">
              Tax Applied: {taxRate}%
            </div>
          </div>
        );
      })}

      <Button type="button" onClick={addItem} className="bg-blue-500 text-white mt-2">
        +
      </Button>
    </>
  );
};
