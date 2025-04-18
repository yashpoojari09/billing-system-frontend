"use client";

import { useState } from "react";
import { updateInventoryItem } from "@/utils/api";
import { inventorySchema } from "@/utils/validation";
import { z } from "zod";
import { ButtonDash } from "@/components/ui/Button";
import { TaxRuleProps } from "@/types/taxRule";
import { InventoryItem } from "@/types/types";


export default function EditInventoryForm(
  { inventoryItem, onClose, fetchInventory, taxRules }: {
    inventoryItem: InventoryItem; onClose: () => void;
    fetchInventory: () => void; taxRules: TaxRuleProps[];
  }) {
  const [name, setName] = useState<string>(inventoryItem.name);
  const [stock, setStock] = useState<number>(inventoryItem.stock);
  const [taxId, setTaxId] = useState<string>(inventoryItem.taxId || "");

  const [price, setPrice] = useState<number>(inventoryItem.price);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input using Zod
      inventorySchema.parse({ name, stock, price, taxId });

      setLoading(true);
      await updateInventoryItem(inventoryItem.id, {
        name,
        stock,
        price,
        taxId
      });
      fetchInventory(); // ✅ Refresh inventory after editing
      setLoading(false);
      onClose(); // Close the modal after successful update
    } catch (err) {
      setLoading(false);
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Failed to update inventory item. Please try again.");
      }
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4 z-50">
<div className="bg-black p-6 rounded-lg  w-full max-w-md shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a]">
        <h2 className="text-lg font-bold mb-6 text-[#ffffff] text-center">
          Edit Inventory Item
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-[#ffffff]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-3 rounded text-[#ffffff]"
            />
          </div>

          {/* Stock Field */}
          <div>
            <label className="block text-sm font-medium text-[#fffff]">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-3 rounded text-[#ffffff]"
            />
          </div>

          {/* Price Field */}
          <div>
            <label className="block text-sm font-medium text-[#fffff]">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-3 rounded text-[#fffff]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#fffff]">Tax Rule</label>
            <select
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-3 rounded text-[#fffff]"
            >
              <option value="">Select Tax Rate</option>
              {taxRules.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.region} - {(tax.taxRate * 100).toFixed(2)}%
                </option>
              ))}
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 flex-wrap">
            <ButtonDash
              title="Cancel"
              variant="blue"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            >
              Cancel
            </ButtonDash>
            <ButtonDash
              title={loading ? "Updating..." : "Update Item"}
              variant="green"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            >
            </ButtonDash>
          </div>
        </form>
      </div>
    </div>
  );
}