"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getTaxRules, createTaxRule, updateTaxRule, deleteTaxRule } from "@/utils/api";
import { TaxRuleProps } from "@/types";

interface TaxRuleContextType {
  taxRules: TaxRuleProps[];
  addTaxRule: (data: Omit<TaxRuleProps, "id">) => Promise<void>;
  editTaxRule: (id: string, data: Partial<TaxRuleProps>) => Promise<void>;
  removeTaxRule: (id: string) => Promise<void>;
}

const TaxRuleContext = createContext<TaxRuleContextType | undefined>(undefined);

export function TaxRuleProvider({ children }: { children: ReactNode }) {
  const [taxRules, setTaxRules] = useState<TaxRuleProps[]>([]);

  useEffect(() => {
    async function loadTaxRules() {
      const data = await getTaxRules();
      setTaxRules(data);
    }
    loadTaxRules();
  }, []);

  const addTaxRule = async (data: Omit<TaxRuleProps, "id">) => {
    try {
      const newTaxRule = await createTaxRule(data);
      setTaxRules((prev) => [...prev, newTaxRule]);
    } catch (error) {
      console.error("Error adding tax rule:", error);
    }
  };

  const editTaxRule = async (id: string, data: Partial<TaxRuleProps>) => {
    try {
      const updatedTaxRule = await updateTaxRule(id, data);
      setTaxRules((prev) =>
        prev.map((rule) => (rule.id === id ? { ...rule, ...updatedTaxRule } : rule))
      );
    } catch (error) {
      console.error("Error editing tax rule:", error);
    }
  };

  const removeTaxRule = async (id: string) => {
    try {
      await deleteTaxRule(id);
      setTaxRules((prev) => prev.filter((rule) => rule.id !== id));
    } catch (error) {
      console.error("Error deleting tax rule:", error);
    }
  };

  return (
    <TaxRuleContext.Provider value={{ taxRules, addTaxRule, editTaxRule, removeTaxRule }}>
      {children}
    </TaxRuleContext.Provider>
  );
}

export function useTaxRules() {
  const context = useContext(TaxRuleContext);
  if (!context) {
    throw new Error("useTaxRules must be used within a TaxRuleProvider");
  }
  return context;
}
