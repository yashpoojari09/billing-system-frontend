"use client";

import { useState } from "react";
import { deleteInventoryItem } from "@/utils/api";
import EditInventory from "./EditInventoryForm";
import { ButtonDash, ButtonEd } from "@/components/ui/Button";
import { TaxRuleProps, } from "@/types/taxRule";
import { InventoryItem } from "@/types/types";
import { FiEdit, FiTrash2 } from "react-icons/fi";


export default function InventoryTable({ inventory, fetchInventory, isLoading, taxRules }: {
  inventory: InventoryItem[]; fetchInventory: () => void; isLoading: boolean; fetchTaxRules: () => void; taxRules: TaxRuleProps[];
}) {
  // const [setInventory] = useState<InventoryItem[]>([]);
  const [editInventoryItem, setEditInventoryItem] = useState<InventoryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // // Fetch inventory data
  // useEffect(() => {
  //   fetchInventory();
  // }, []);

  // const fetchInventory = async () => {
  //   try {
  //     const data = await getInventory();
  //     setInventory(data);
  //   } catch (error) {
  //     console.error("Error fetching inventory:", error);
  //   }
  // };



  // Handle delete confirmation
  const handleDelete = async () => {
    if (!confirmDelete.id) return;

    try {
      await deleteInventoryItem(confirmDelete.id);

      fetchInventory();
      
      // setInventory((prev) => prev.filter((item) => item.id !== confirmDelete.id));
      setConfirmDelete({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  return (
    <div className="bg-dark shadow rounded-lg">

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? ( // ✅ Show loading while fetching
          <div className="text-center text-white">Loading Inventory...</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-white">

          <table className="w-full border-collapse border border-white min-w-[350px]">
            <thead>
              <tr className="bg-dark text-[#ffffff]">
                <th className="border p-2">Name</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Tax Rate</th>

                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <tr key={item.id} className="text-center  text-[#ffffff]">
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2 ">{item.stock}</td>
                    <td className="border p-2">${item.price}</td>
                    <td className="border p-2 ">
                      {taxRules.find(t => t.id === item.taxId)?.taxRate
                        ? `${(taxRules.find(t => t.id === item.taxId)!.taxRate * 100).toFixed(2)}%`
                        : "N/A"}
                    </td>

                    <td className="border p-2 space-x-2">
                      {/* Edit Button */}
                      <ButtonEd variant="edit"
                        onClick={() => setEditInventoryItem(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto"
                      >
                                                <FiEdit className="h-4 w-4" />
                        
                      </ButtonEd>

                      {/* Delete Button */}
                      <ButtonEd variant="delete" onClick={() => setConfirmDelete({ isOpen: true, id: item.id })} className="bg-red-600 text-white px-3 py-1 rounded-md">
  <FiTrash2 className="h-4 w-4" />
                      </ButtonEd>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="border p-2 text-center text-gray-500">
                    No inventory items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Edit Confirmation Modal */}
      {editInventoryItem && <EditInventory inventoryItem={editInventoryItem} onClose={() => setEditInventoryItem(null)} fetchInventory={fetchInventory} taxRules={taxRules} />}

      {/* Delete Confirmation Modal */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-[#000000]">Are you sure?</h2>
            <p className="mb-4 text-[#000000]">Do you really want to delete this inventory item?</p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <ButtonDash title="Cancel" variant="blue" onClick={() => setConfirmDelete({ isOpen: false, id: null })} className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                Cancel
              </ButtonDash>
              <ButtonEd title="Yes, Delete" variant="delete" onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                Yes, Delete
              </ButtonEd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
