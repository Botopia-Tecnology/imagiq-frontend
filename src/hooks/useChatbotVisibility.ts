"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  CHATBOT_HIDDEN_ROUTES,
  CHATBOT_VISIBLE_ROUTES,
} from "@/constants/chatbotRoutes";

/**
 * Hook para determinar la visibilidad del chatbot basado en la ruta actual.
 *
 * Reglas de prioridad:
 * 1. Si ruta está en CHATBOT_VISIBLE_ROUTES → MOSTRAR
 * 2. Si ruta está en CHATBOT_HIDDEN_ROUTES → OCULTAR
 * 3. Por defecto → MOSTRAR
 *
 * @returns boolean - true si el chatbot debe ser visible
 */
export function useChatbotVisibility(): boolean {
  const pathname = usePathname();

  return useMemo(() => {
    if (!pathname) return true;

    // Prioridad 1: Rutas explícitamente visibles
    const isExplicitlyVisible = CHATBOT_VISIBLE_ROUTES.some((route) =>
      route.endsWith("/") ? pathname.startsWith(route) : pathname === route
    );
    if (isExplicitlyVisible) return true;

    // Prioridad 2: Rutas ocultas
    const isHidden = CHATBOT_HIDDEN_ROUTES.some((route) =>
      route.endsWith("/") ? pathname.startsWith(route) : pathname === route
    );
    if (isHidden) return false;

    // Por defecto: visible
    return true;
  }, [pathname]);
}
