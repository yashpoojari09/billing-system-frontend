"use client";
import { useForm } from "react-hook-form";
import { createTaxRule } from "@/utils/api";
import { taxRuleSchema } from "@/utils/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonDash } from "@/components/ui/Button";


type TaxRuleFormValues = z.infer<typeof taxRuleSchema>

export default function AddTaxRuleForm({ onClose }: { onClose: () => void }) {
  // const [taxRate, setTaxRate] = useState<number | "">("");
  // const [region, setRegion] = useState("");
  // const [error, setError] = useState<string | null>(null);
 const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaxRuleFormValues>({
    resolver: zodResolver(taxRuleSchema),
  });

  const onSubmit = async (data:TaxRuleFormValues ) => {
    try {
      await createTaxRule(data);
      reset()
      onClose();
      // setTaxRate("");
      // setRegion("");
      // setError(null);
    } catch (error) {
      console.error("Error adding inventory:", error);
      }
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96"></div>
          <h2 className="text-lg font-bold mb-2 text-[#000000]">Add Tax Rule</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 shadow rounded-lg">
              {/* Tax Field */}
              <div>
                <label className="block text-sm font-medium text-[#001e38]">taxRate</label>
                <input {...register("taxRate")} className="w-full border p-3 rounded text-[#001e38]" />
                {errors.taxRate && <p className="text-red-500 text-sm">{errors.taxRate.message}</p>}
              </div>
               {/* Region Field */}
               <div>
                <label className="block text-sm font-medium text-[#001e38]">taxRate</label>
                <input {...register("region")} className="w-full border p-3 rounded text-[#001e38]" />
                {errors.region && <p className="text-red-500 text-sm">{errors.region.message}</p>}
              </div>
  {/* Submit Button */}
  <div className="flex justify-between">
                 <ButtonDash title="cancel"variant="blue" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                  Cancel
                </ButtonDash>
                <ButtonDash title="addTaxRule" variant="green" disabled={isSubmitting} className="bg-green-600 text-white px-4 py-2 rounded-md">
                  {isSubmitting ? "Adding..." : "Add Item"}
                </ButtonDash>
              </div>
    </form>
    </div>
       

  );
}
