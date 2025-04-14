// stores/useInventoryStore.ts
import { create } from "zustand";
import { Product } from "@/types/types";

interface InventoryStore {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setSelectedProduct: (product: Product) => void;
  newProduct: Product | null;
  clearNewProduct: () => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  isModalOpen: false,
  newProduct: null,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setSelectedProduct: (product) => set({ newProduct: product }),
  clearNewProduct: () => set({ newProduct: null }),
}));
