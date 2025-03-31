"use client";

import { useState } from "react";
import { updateTaxRule } from "@/utils/api";
import { taxRuleSchema } from "@/utils/validation";
import { z } from "zod";
import { ButtonDash } from "@/components/ui/Button";

export default function EditTaxRuleForm({
  taxRule,
  onClose,
}: {
  taxRule: { id: string; taxRate: number; region: string };
  onClose: () => void;
}) {
  const [taxRate, setTaxRate] = useState<number>(taxRule.taxRate);
  const [region, setRegion] = useState<string>(taxRule.region);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input using Zod
      taxRuleSchema.parse({ taxRate, region });

      setLoading(true);
      await updateTaxRule(taxRule.id, { taxRate, region });

      setLoading(false);
      onClose(); // Close the modal after successful update
    } catch (err) {
      setLoading(false);
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Failed to update tax rule. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-[#000000]">Edit Tax Rule</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleUpdate}>
          <label className="block mb-2">Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="border p-2 w-full mb-2 text-[#000000]"
          />

          <label className="block mb-2">Region</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border p-2 w-full mb-2 text-[#000000]"
          />

          <div className="flex justify-between mt-4">
            <ButtonDash  title="cancel" variant="blue" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md">
              Cancel
            </ButtonDash>
            <ButtonDash variant="green" title="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md">
              {loading ? "Updating..." : "Update"}
            </ButtonDash>
          </div>
        </form>
      </div>
    </div>
  );
}
