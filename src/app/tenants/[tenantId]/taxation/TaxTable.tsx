"use client";

import { useState, useEffect } from "react";
import { getTaxRules, deleteTaxRule } from "@/utils/api";
import EditTaxRuleForm from "./EditTaxRuleForm";
import { TaxRuleProps } from "@/types";
import { ButtonEd } from "@/components/ui/Button";

export default function TaxationTable() {
  const [taxRules, setTaxRules] = useState<TaxRuleProps[]>([]);
  const [editTaxRule, setEditTaxRule] = useState<TaxRuleProps | null>(null);
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
      <h2 className="text-xl font-bold mb-4 text-[#001e38]">Taxation Rules</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-[#001e38]">
            <th className="border p-2 text-sm sm:text-base">Tax Rate (%)</th>
            <th className="border p-2 text-sm sm:text-base">Region</th>
            <th className="border p-2 text-sm sm:text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxRules.map((tax) => (
            <tr key={tax.id} className="border text-[#001e38]">
              <td className="p-2 border text-sm sm:text-base">{tax.taxRate}%</td>
              <td className="p-2 border text-sm sm:text-base">{tax.region}</td>
              <td className="p-2 border text-sm sm:text-base justify-centre gap-2">
                <ButtonEd
                  variant="edit"
                  onClick={() => setEditTaxRule(tax)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                >
                  Edit
                </ButtonEd>
                <ButtonEd
                  variant="delete"
                  onClick={() => setDeleteTaxId({ isOpen: true, id: tax.id })}
                  className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                >
                  Delete
                </ButtonEd>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editTaxRule && <EditTaxRuleForm taxRule={editTaxRule} onClose={() => setEditTaxRule(null)} />}
      {/* Delete Confirmation Modal */}
      {deleteTaxId.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-auto">
            <h2 className="text-lg font-bold mb-4 text-[#001e38]">Are you sure?</h2>
            <p className="mb-4 text-[#001e38]">Do you really want to delete this inventory item?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <ButtonEd
                variant="edit"
                onClick={() => setDeleteTaxId({ isOpen: false, id: null })}
                className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Cancel
              </ButtonEd>
              <ButtonEd
                variant="delete"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Yes, Delete
              </ButtonEd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
