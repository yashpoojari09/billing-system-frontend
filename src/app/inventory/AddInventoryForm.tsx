"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema } from "@/utils/validation";
import { addInventoryItem } from "@/utils/api";
import { z } from "zod";

type InventoryFormValues = z.infer<typeof inventorySchema>;


export default function AddInventory({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
  });

  // Handle form submission
  const onSubmit = async (data: InventoryFormValues) => {
    try {
      await addInventoryItem(data);
      reset();
      onClose(); // Refresh inventory list
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  return (
    <>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Add Inventory Item</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-[#001e38]">Name</label>
                <input {...register("name")} className="w-full border p-3 rounded text-[#001e38]" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Stock Field */}
              <div>
                <label className="block text-sm font-medium text-[#001e38]">Stock</label>
                <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full border p-2 rounded text-[#001e38]" />
                {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-medium text-[#001e38]">Price</label>
                <input type="number" {...register("price", { valueAsNumber: true })} className="w-full border p-2 rounded text-[#001e38]" />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-between">
                <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-md">
                  {isSubmitting ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </>
  );
}
