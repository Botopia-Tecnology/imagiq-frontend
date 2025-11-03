"use client";

import { SearchHeader } from "@/components/sections/soporte/buscar/SearchHeader";
import { FiltersSidebar } from "@/components/sections/soporte/buscar/FiltersSidebar";
import { ResultsList } from "@/components/sections/soporte/buscar/ResultsList";

export default function BuscarSoportePage() {
  return (
    <div className="bg-white">
      <SearchHeader />
      <div className="flex">
        <FiltersSidebar />
        <ResultsList />
      </div>
    </div>
  );
}
