"use client";

import { useState, useEffect } from "react";
import { getInventory, deleteInventoryItem } from "@/utils/api";
import EditInventory from "./EditInventoryForm";
import { ButtonEd } from "@/components/ui/Button";

type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
};

export default function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // Fetch inventory data
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!confirmDelete.id) return;

    try {
      await deleteInventoryItem(confirmDelete.id);
      setInventory((prev) => prev.filter((item) => item.id !== confirmDelete.id));
      setConfirmDelete({ isOpen: false, id: null });
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4 text-gray-700">Inventory List</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-[#001e38]">
              <th className="border p-2 ">Name</th>
              <th className="border p-2 ">Stock</th>
              <th className="border p-2 ">Price</th>
              <th className="border p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item.id} className="text-center">
                  <td className="border p-2 text-[#001e38]">{item.name}</td>
                  <td className="border p-2 text-[#001e38]">{item.stock}</td>
                  <td className="border p-2 text-[#001e38]">${item.price}</td>
                  <td className="border p-2 space-x-2">
                    {/* Edit Button */}
                    <ButtonEd variant="edit" onClick={() => setSelectedItem(item)} className="bg-yellow-500 text-white px-3 py-1 rounded-md">
                      Edit
                    </ButtonEd>

                    {/* Delete Button */}
                    <ButtonEd variant="delete" onClick={() => setConfirmDelete({ isOpen: true, id: item.id })} className="bg-red-600 text-white px-3 py-1 rounded-md">
                      Delete
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

      {/* Edit Inventory Modal */}
      {selectedItem && <EditInventory inventory={selectedItem} onUpdate={fetchInventory} />}

      {/* Delete Confirmation Modal */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you really want to delete this inventory item?</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setConfirmDelete({ isOpen: false, id: null })} className="bg-gray-400 text-white px-4 py-2 rounded-md">
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
