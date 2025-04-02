"use client";
import { useForm } from "react-hook-form";
import { createTaxRule } from "@/utils/api";
import { taxRuleSchema } from "@/utils/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonDash } from "@/components/ui/Button";

type TaxRuleFormValues = z.infer<typeof taxRuleSchema>;

export default function AddTaxRuleForm({ onClose, fetchTaxRules }: { onClose: () => void, fetchTaxRules:() => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxRuleFormValues>({
    resolver: zodResolver(taxRuleSchema),
  });

  const onSubmit = async (data: TaxRuleFormValues) => {
    try {
      await createTaxRule(data);
      fetchTaxRules();
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding tax rule:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-2 text-[#000000]">Add Tax Rule</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tax Rate Field */}
          <div>
            <label className="block text-sm font-medium text-[#001e38]">Tax Rate</label>
            <input
              type="number"
              step="0.01"
              {...register("taxRate", {
                required: "Tax rate is required",
                valueAsNumber: true,
              })}
              className="w-full border p-3 rounded text-[#001e38]"
            />
            {errors.taxRate && <p className="text-red-500 text-sm">{errors.taxRate.message}</p>}
          </div>

          {/* Region Field */}
          <div>
            <label className="block text-sm font-medium text-[#001e38]">Region</label>
            <input
              {...register("region", { required: "Region is required" })}
              className="w-full border p-3 rounded text-[#001e38]"
            />
            {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <ButtonDash
              title="Cancel"
              variant="blue"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            />
            <ButtonDash
              title={isSubmitting ? "Adding..." : "Add Tax Rule"}
              variant="green"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
    </div>
  );
}