"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SelectedStoreContextType {
  selectedStoreCode: number | null;
  setSelectedStoreCode: (code: number | null) => void;
}

const SelectedStoreContext = createContext<SelectedStoreContextType | undefined>(undefined);

export function SelectedStoreProvider({ children }: { children: ReactNode }) {
  const [selectedStoreCode, setSelectedStoreCode] = useState<number | null>(null);

  return (
    <SelectedStoreContext.Provider value={{ selectedStoreCode, setSelectedStoreCode }}>
      {children}
    </SelectedStoreContext.Provider>
  );
}

export function useSelectedStore() {
  const context = useContext(SelectedStoreContext);
  if (context === undefined) {
    throw new Error("useSelectedStore must be used within a SelectedStoreProvider");
  }
  return context;
}
