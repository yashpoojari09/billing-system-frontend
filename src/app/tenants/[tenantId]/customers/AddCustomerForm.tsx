"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/utils/validation";
import { addCustomer } from "@/utils/api";
import { z } from "zod";
import { Customer } from "@/types";

type CustomerFormValues = z.infer<typeof customerSchema>;


export default function AddCustomerForm({
  onClose,
  onCustomerAdded, // ✅ Accept the function
}: {
  onClose: () => void;
  onCustomerAdded: (customer:Customer) => void; // ✅ Define prop type
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({ resolver: zodResolver(customerSchema) });


  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    try {
      const newCustomer = await addCustomer(data); // ✅ Get newly added customer
      onCustomerAdded(newCustomer); // ✅ Update Customers list in parent
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-[#000000]">Add Customer</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input {...register("name")} className="w-full border p-2 rounded text-[#000000]" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-[#000000]">Email</label>
            <input {...register("email")} className="w-full border p-2 rounded" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-md">
              {isSubmitting ? "Adding..." : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
