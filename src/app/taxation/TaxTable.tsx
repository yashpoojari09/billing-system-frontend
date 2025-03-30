"use client";

import { useState, useEffect } from "react";
import { getTaxRules } from "@/utils/api";
import EditTaxRuleForm from "./EditTaxRuleForm";
import DeleteTaxRuleModal from "./DeleteTaxRuleModal";

export default function TaxationTable() {
  const [taxRules, setTaxRules] = useState<{ id: string; taxRate: number; region: string }[]>([]);
  const [editTaxRule, setEditTaxRule] = useState<{ id: string; taxRate: number; region: string } | null>(null);
  const [deleteTaxId, setDeleteTaxId] = useState<string | null>(null);

  useEffect(() => {
    fetchTaxRules();
  }, []);

  const fetchTaxRules = async () => {
    const data = await getTaxRules();
    setTaxRules(data);
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Taxation Rules</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tax Rate (%)</th>
            <th className="border p-2">Region</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxRules.map((tax) => (
            <tr key={tax.id} className="border">
              <td className="p-2 border">{tax.taxRate}%</td>
              <td className="p-2 border">{tax.region}</td>
              <td className="p-2 border">
                <button onClick={() => setEditTaxRule(tax)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => setDeleteTaxId(tax.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editTaxRule && <EditTaxRuleForm taxRule={editTaxRule} onClose={() => setEditTaxRule(null)} />}
      {deleteTaxId && <DeleteTaxRuleModal taxId={deleteTaxId} onClose={() => setDeleteTaxId(null)} onDelete={fetchTaxRules} />}
    </div>
  );
}
