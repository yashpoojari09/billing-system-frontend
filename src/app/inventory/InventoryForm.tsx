import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inventorySchema } from "@/utils/validation";
import { addInventoryItem, updateInventoryItem } from "@/utils/api";
import { useEffect } from "react";

type InventoryFormProps = {
  initialData?: { id?: string; name: string; stock: number; price: number } | null;
  onSuccess: () => void;
};

export default function InventoryForm({ initialData, onSuccess }: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: initialData || { name: "", stock: 1, price: 0 },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: { name: string; stock: number; price: number }) => {
    try {
      if (initialData?.id) {
        await updateInventoryItem(initialData.id, data);
      } else {
        await addInventoryItem(data);
      }
      onSuccess();
      reset();
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white rounded shadow-md space-y-4">
      <input {...register("name")} placeholder="Name" className="w-full p-2 border rounded" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}

      <input {...register("stock")} type="number" placeholder="Stock" className="w-full p-2 border rounded" />
      {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}

      <input {...register("price")} type="number" placeholder="Price" className="w-full p-2 border rounded" />
      {errors.price && <p className="text-red-500">{errors.price.message}</p>}

      <button type="submit" className="bg-[#001e38] text-white px-4 py-2 rounded">
        {initialData ? "Update" : "Add"} Inventory
      </button>
    </form>
  );
}
