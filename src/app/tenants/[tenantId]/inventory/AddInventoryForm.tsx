"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema } from "@/utils/validation";
import { addInventoryItem } from "@/utils/api";
import { z } from "zod";
import { ButtonDash } from "@/components/ui/Button";
import { TaxRuleProps } from "@/types/taxRule";

type InventoryFormValues = z.infer<typeof inventorySchema>;

export default function AddInventory({ onClose, fetchInventory, fetchTaxRules, taxes }: {
  onClose: () => void; fetchInventory: () => void;
  fetchTaxRules: () => void; taxes: TaxRuleProps[];
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      stock: 0,
      price: 0,
      taxId: '', // Set the default taxId here
    },
  });
 
  // Handle form submission
  const onSubmit = async (data: InventoryFormValues) => {
    try {
      await addInventoryItem(data);
      fetchInventory(); // ✅ Refresh inventory after adding
      fetchTaxRules(); // ✅ Refresh inventory after adding
      reset();
      onClose(); // Refresh inventory list
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };



  return (
    <>
<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4 z-50">
<div className="bg-black p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full max-w-md">
          <h2 className="text-lg font-bold mb-6 text-white text-center">Add Inventory Item</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-[#fffff]">Name</label>
              <input
                {...register("name")}
                className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-3 rounded text-[#fffff]"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Stock Field */}
            <div>
              <label className="block text-sm font-medium text-[#fffff]">Stock</label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-2 rounded text-[#fffff]"
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-[#fffff]">Price</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-2 rounded text-[#fffff]"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <select
              {...register("taxId")}
              className="w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] p-2 rounded text-[#fffff]"
            >
              <option value="">Select Tax Rate</option>
              {taxes.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.region} - {(tax.taxRate * 100).toFixed(2)}%
                </option>
              ))}

            </select>
            {errors.taxId && <p className="text-red-500 text-sm">{errors.taxId.message}</p>}

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <ButtonDash
                title="Cancel"
                variant="blue"
                onClick={onClose}
                className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Cancel
              </ButtonDash>
              <ButtonDash
                title={isSubmitting ? "Adding..." : "Add Item"}
                variant="green"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
              </ButtonDash>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

