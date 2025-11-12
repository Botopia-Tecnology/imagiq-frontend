"use client";

/**
 *
 * Componente que verifica la versión de la aplicación al cargar
 * y limpia el localStorage si detecta una nueva versión.
 */

import { useEffect } from "react";
import { checkAndUpdateVersion } from "@/utils/versionManager";

export default function VersionManager() {
  useEffect(() => {
    // Ejecutar la verificación de versión al montar el componente
    checkAndUpdateVersion();
  }, []);

  // Este componente no renderiza nada
  return null;
}
