"use client";

import { useState } from "react";
import { createTaxRule } from "@/utils/api";
import { taxRuleSchema } from "@/utils/validation";
import { z } from "zod";

export default function AddTaxRuleForm({ onAdd }: { onAdd: () => void }) {
  const [taxRate, setTaxRate] = useState<number | "">("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      taxRuleSchema.parse({ taxRate: Number(taxRate), region });
      await createTaxRule({ taxRate: Number(taxRate), region });
      onAdd();
      setTaxRate("");
      setRegion("");
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-2 text-[#000000]">Add Tax Rule</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="number"
        placeholder="Tax Rate (%)"
        value={taxRate}
        onChange={(e) => setTaxRate(e.target.value === "" ? "" : Number(e.target.value))}
        className="border p-2 w-full mb-2 text-[#000000]"
      />
      <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} className="border p-2 w-full mb-2 text-[#001e38]" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md w-full">
        Add Tax Rule
      </button>
    </form>
  );
}
