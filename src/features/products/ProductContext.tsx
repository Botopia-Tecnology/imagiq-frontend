// src/features/product/ProductContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type ProductContextType = {
  isAppliance: boolean;
  setIsAppliance: (v: boolean) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [isAppliance, setIsAppliance] = useState(false);

  return (
    <ProductContext.Provider value={{ isAppliance, setIsAppliance }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return ctx;
}

export default ProductProvider;
