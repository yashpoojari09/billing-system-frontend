"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import AddTaxRuleForm from "./AddTaxRuleForm";
import EditTaxRuleForm from "./EditTaxRuleForm";
import {API_URL} from "@/utils/api"
import {Button} from "@/components/ui/Button"
import { useRouter, useParams } from "next/navigation";

export default function TaxationPage() {
  const [taxRules, setTaxRules] = useState<{ id: string; taxRate: number; region: string }[]>([]);
  const [editTaxRule, setEditTaxRule] = useState<{ id: string; taxRate: number; region: string } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTaxId, setDeleteTaxId] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams()
  const tenantId = params?.tenantId;

  // Fetch tax rules from API
  useEffect(() => {
    const fetchTaxRules = async () => {
      try {
        const response = await axios.get(`${API_URL}/taxation`);
        setTaxRules(response.data);
      } catch (error) {
        console.error("Error fetching tax rules:", error);
      }
    };
    fetchTaxRules();
  }, []);

  // Delete Tax Rule
  const handleDeleteTaxRule = async (taxId: string) => {
    try {
      await axios.delete(`${API_URL}taxation/${taxId}`);
      setTaxRules((prev) => prev.filter((tax) => tax.id !== taxId)); // Remove from UI
      setDeleteTaxId(null); // Close modal
    } catch (error) {
      console.error("Error deleting tax rule:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Taxation Management</h1>
   
              <Button type="button" onClick={() => router.push(`/tenants/${tenantId}`)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                </svg>
                 Back To Dashboard
              </Button>

      {/* Add New Tax Rule Button */}
      <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4">
        + Add Tax Rule
      </button>

      {/* Taxation Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Tax Rate (%)</th>
            <th className="border p-2">Region</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {taxRules.map((tax) => (
            <tr key={tax.id} className="border ">
              <td className="border p-2">{tax.taxRate}%</td>
              <td className="border p-2">{tax.region}</td>
              <td className="border p-2">
                {/* Edit Button */}
                <button
                  onClick={() => setEditTaxRule(tax)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteTaxId(tax.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Tax Rule Modal */}
      {isAddModalOpen && <AddTaxRuleForm onAdd={() => setIsAddModalOpen(false)} />}

      {/* Edit Tax Rule Modal */}
      {editTaxRule && <EditTaxRuleForm taxRule={editTaxRule} onClose={() => setEditTaxRule(null)} />}

      {/* Delete Confirmation Modal */}
      {deleteTaxId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this tax rule?</p>
            <div className="flex justify-between mt-4">
              <button onClick={() => setDeleteTaxId(null)} className="bg-gray-400 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
              <button onClick={() => handleDeleteTaxRule(deleteTaxId)} className="bg-red-600 text-white px-4 py-2 rounded-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
}
