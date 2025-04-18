"use client";

import { useState } from "react";
import { deleteTaxRule } from "@/utils/api";
import EditTaxRuleForm from "./EditTaxRuleForm";
import { TaxRuleProps } from "@/types/taxRule";
import { ButtonEd } from "@/components/ui/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function TaxationTable({fetchTaxRules, taxRules, isLoading}: { taxRules: TaxRuleProps[]; fetchTaxRules: () => void; isLoading:boolean }) {
  const [editTaxRule, setEditTaxRule] = useState<TaxRuleProps | null>(null);
  const [deleteTaxId, setDeleteTaxId] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });



  // Handle delete confirmation
  const handleDelete = async () => {
    if (!deleteTaxId.id) return;

    try {
      await deleteTaxRule(deleteTaxId.id);
      fetchTaxRules()
      setDeleteTaxId({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  return (
    <div className="bg-dark shadow rounded-lg">
      {isLoading ? ( // ✅ Show loading while fetching
        <div className="text-center text-white">Loading Taxation Rules...</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white">

      <table className="w-full border-collapse border border-white">
        <thead>
          <tr className="bg-dark text-[#ffffff]">
            <th className="border p-2 text-sm sm:text-base">Tax Rate (%)</th>
            <th className="border p-2 text-sm sm:text-base">Region</th>
            <th className="border p-2 text-sm sm:text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxRules.map((tax) => (
            <tr key={tax.id} className="text-center text-[#fffff]">
              <td className="p-2 border text-sm sm:text-base">{(tax.taxRate * 100).toFixed(2)}%</td>
              <td className="p-2 border text-sm sm:text-base">{tax.region}</td>
              <td className="p-2 border text-sm sm:text-base justify-centre gap-2">
                <ButtonEd
                  variant="edit"
                  onClick={() => setEditTaxRule(tax)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                >
                                                                  <FiEdit className="h-4 w-4" />

                </ButtonEd>
                <ButtonEd
                  variant="delete"
                  onClick={() => setDeleteTaxId({ isOpen: true, id: tax.id })}
                  className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto"
                >
  <FiTrash2 className="h-4 w-4" />
  </ButtonEd>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}

      {editTaxRule && <EditTaxRuleForm taxRules={editTaxRule} onClose={() => setEditTaxRule(null)}  fetchTaxRules={fetchTaxRules}/>}
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
