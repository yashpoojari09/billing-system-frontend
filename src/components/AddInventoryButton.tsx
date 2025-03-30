export const AddInventoryButton = ({ onClick }: { onClick?: () => void }) => (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition"
      aria-label="Add Inventory"
    >
      + Add Inventory
    </button>
  );