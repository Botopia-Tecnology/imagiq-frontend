"use client";
import { apiGet } from "@/lib/api-client";
import { useEffect, useState } from "react";

export function useCities() {
  const [cities, setCities] = useState<{ codigo: string; nombre: string }[]>(
    []
  );
  const fetchCities = async () => {
    await apiGet<{ codigo: string; nombre: string }[]>(
      "/api/addresses/zonas-cobertura/ciudades"
    ).then((res) => setCities(res));
  };
  useEffect(() => {
    fetchCities();
  }, []);
  return { cities, setCities };
}
