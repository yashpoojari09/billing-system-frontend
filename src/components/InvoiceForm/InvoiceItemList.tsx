"use client";

import { InvoiceItem, Product } from "@/types/types";
import { Button } from "@/components/ui/Button";
import { FiTrash, FiPlus } from "react-icons/fi";
import Select from "react-select";

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
          <div key={index} className="flex flex-col gap-1 mb-4 border p-3 rounded-md text-[#ffffff] bg-dark">
            <div className="flex gap-2 items-center">
            <Select
                  className="text-black"
                  classNamePrefix="react-select"
                  placeholder="Select Product"
                  options={products.map((p) => ({
                    value: p.id,
                    label: `${p.name} - ₹${p.price}`,
                  }))}
                  value={
                    item.productId
                      ? {
                          value: item.productId,
                          label: `${product?.name} - ₹${product?.price}`,
                        }
                      : null
                  }
                  onChange={(selected) => {
                    if (selected) {
                      handleProductChange(index, selected.value);
                    }
                  }}
                />

              <input
                type="number"
                value={item.quantity}
                className="border p-2 w-1/4 rounded-md"
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

            <div className="text-sm text-gray-200 pl-1">
              Tax Applied: {taxRate}%
            </div>
          </div>
        );
      })}

      <Button type="button" onClick={addItem} className="bg-blue-500 text-white mt-2">
                  <FiPlus className="h-5 w-5" />
        
      </Button>
    </>
  );
};
