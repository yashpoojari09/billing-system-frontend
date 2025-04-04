"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/utils/validation";
import { addCustomer } from "@/utils/api";
import { z } from "zod";
import { Customer } from "@/types";
import { ButtonDash } from "@/components/ui/Button";

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function AddCustomerForm({
  onClose,
  onCustomerAdded,
}: {
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
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
      const newCustomer = await addCustomer(data);
      onCustomerAdded(newCustomer);
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-black text-center">Add Customer</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              {...register("name")}
              className="w-full border p-2 rounded text-black"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email")}
              className="w-full border p-2 rounded text-black"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              {...register("phone")}
              className="w-full border p-2 rounded text-black"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>


          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <ButtonDash
              title="Cancel"
              variant="blue"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancel
            </ButtonDash>
            <ButtonDash
              title={isSubmitting ? "Adding..." : "Add Customer"}
              variant="green"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md"
            >
              
            </ButtonDash>
          </div>
        </form>
      </div>
    </div>
  );
}
