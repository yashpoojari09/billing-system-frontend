"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema } from "@/utils/validation";
import { updateInventoryItem } from "@/utils/api";
import { z } from "zod";

type InventoryFormValues = z.infer<typeof inventorySchema>;

export default function EditInventory({
  inventory,
  onUpdate,
}: {
  inventory: { id: string; name: string; stock: number; price: number };
  onUpdate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: inventory.name,
      stock: inventory.stock,
      price: inventory.price,
    },
  });

  // Handle form submission
  const onSubmit = async (data: InventoryFormValues) => {
    try {
      await updateInventoryItem(inventory.id, data);
      reset();
      setIsOpen(false);
      onUpdate(); // Refresh inventory list
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <button onClick={() => setIsOpen(true)} className="bg-yellow-500 text-white px-3 py-1 rounded-md">
        Edit
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Edit Inventory Item</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input {...register("name")} className="w-full border p-2 rounded" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              {/* Stock Field */}
              <div>
                <label className="block text-sm font-medium">Stock</label>
                <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full border p-2 rounded" />
                {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-medium">Price</label>
                <input type="number" {...register("price", { valueAsNumber: true })} className="w-full border p-2 rounded" />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsOpen(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  {isSubmitting ? "Updating..." : "Update Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
