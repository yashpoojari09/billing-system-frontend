"use client";

import { useState, useEffect } from "react";
import { getTaxRules, deleteTaxRule } from "@/utils/api";
import EditTaxRuleForm from "./EditTaxRuleForm";
import {TaxRuleProps }from "@/types"

export default function TaxationTable() {
  const [taxRules, setTaxRules] = useState<TaxRuleProps[]>([]);
  const [editTaxRule, setEditTaxRule] = useState<TaxRuleProps| null>(null);
  const [deleteTaxId, setDeleteTaxId] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    fetchTaxRules();
  }, []);

  const fetchTaxRules = async () => {
    const data = await getTaxRules();
    setTaxRules(data);
  };
   // Handle delete confirmation
    const handleDelete = async () => {
      if (!deleteTaxId.id) return;
  
      try {
        await deleteTaxRule(deleteTaxId.id);
        setTaxRules((prev) => prev.filter((item) => item.id !== deleteTaxId.id));
        setDeleteTaxId({ isOpen: false, id: null });
      } catch (error) {
        console.error("Error deleting inventory:", error);
      }
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
                <button onClick={() => setDeleteTaxId({ isOpen: true, id:tax.id })} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editTaxRule && <EditTaxRuleForm taxRule={editTaxRule} onClose={() => setEditTaxRule(null)} />}
        {/* Delete Confirmation Modal */}
      {deleteTaxId.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you really want to delete this inventory item?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setDeleteTaxId({ isOpen: false, id: null })} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
