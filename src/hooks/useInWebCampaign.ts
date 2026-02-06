import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { connectSocket } from "@/lib/socket";
import type { CampaignData } from "@/components/InWebCampaign/types";

interface UseInWebCampaignOptions {
  channelName?: string; // Nombre del canal (por defecto "inweb")
}

interface CampaignWithId extends CampaignData {
  id: string; // ID único generado para la campaña
}

/**
 * Genera un ID único para una campaña basado en sus propiedades
 */
function generateCampaignId(campaign: CampaignData): string {
  // Usar timestamp + propiedades clave para generar un ID único
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const campaignKey = `${campaign.campaign_name || ''}_${campaign.image_url || ''}_${campaign.html_content?.substring(0, 30) || ''}`;
  // Crear un hash simple del contenido
  let hash = 0;
  for (let i = 0; i < campaignKey.length; i++) {
    const char = campaignKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  return `campaign_${timestamp}_${Math.abs(hash)}_${random}`;
}

/**
 * Valida si la ruta actual coincide con las rutas permitidas de la campaña
 * Soporta:
 * - "*" o undefined → mostrar en todas las rutas
 * - Ruta exacta (ej: "/") → mostrar solo en esa ruta
 * - Wildcard (ej: "/productos/*") → mostrar en todas las rutas que empiecen con el prefijo
 */
function shouldShowCampaign(pathname: string, previewUrl?: string): boolean {
  // Si no hay preview_url definida, mostrar en todas las rutas
  if (!previewUrl) return true;

  // Si es "*", mostrar en todas las rutas
  if (previewUrl === "*") return true;

  // Si termina con "/*", es un wildcard
  if (previewUrl.endsWith("/*")) {
    const prefix = previewUrl.slice(0, -2); // Remover "/*"
    // Coincide si la ruta es exactamente el prefijo o empieza con el prefijo seguido de "/"
    return pathname === prefix || pathname.startsWith(prefix + "/");
  }

  // Coincidencia exacta
  return pathname === previewUrl;
}

/**
 * Hook para gestionar campañas InWeb desde socket
 *
 * Soporta múltiples campañas activas simultáneamente.
 * La validación de rutas se hace según el campo `preview_url` que viene en el evento:
 * - Si `preview_url` es "*" o undefined, se muestra en todas las rutas
 * - Si `preview_url` es una ruta específica (ej: "/"), solo se muestra en esa ruta
 * - Si `preview_url` es un wildcard (ej: "/productos/*"), se muestra en todas las rutas que empiecen con ese prefijo
 *
 */
export function useInWebCampaign(
  options: UseInWebCampaignOptions = {}
) {
  const { channelName = "inweb" } = options;
  const pathname = usePathname();

  const [activeCampaigns, setActiveCampaigns] = useState<CampaignWithId[]>([]);
  const [pendingCampaigns, setPendingCampaigns] = useState<CampaignWithId[]>([]);

  // Verificar si hay campañas pendientes que deban mostrarse cuando cambia la ruta
  useEffect(() => {
    const campaignsToShow: CampaignWithId[] = [];
    const remainingPending: CampaignWithId[] = [];

    pendingCampaigns.forEach((campaign) => {
      if (shouldShowCampaign(pathname, campaign.preview_url)) {
        campaignsToShow.push(campaign);
      } else {
        remainingPending.push(campaign);
      }
    });

    if (campaignsToShow.length > 0) {
      setActiveCampaigns((prev) => {
        // Evitar duplicados basándose en el ID
        const existingIds = new Set(prev.map((c) => c.id));
        const newCampaigns = campaignsToShow.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newCampaigns];
      });
      setPendingCampaigns(remainingPending);
    }
  }, [pathname, pendingCampaigns]);

  // Verificar campañas activas cuando cambia la ruta (ocultar las que no coinciden)
  useEffect(() => {
    setActiveCampaigns((prev) => {
      return prev.filter((campaign) => shouldShowCampaign(pathname, campaign.preview_url));
    });
  }, [pathname]);

  useEffect(() => {
    const socket = connectSocket(channelName);

    socket.on("campaign_start", (msg: CampaignData) => {
      // Generar ID único para la campaña
      const campaignWithId: CampaignWithId = {
        ...msg,
        id: generateCampaignId(msg),
      };

      // Validar ruta de la campaña usando preview_url
      const shouldShow = shouldShowCampaign(pathname, msg.preview_url);

      if (shouldShow) {
        setActiveCampaigns((prev) => {
          // Evitar duplicados
          const existingIds = new Set(prev.map((c) => c.id));
          if (existingIds.has(campaignWithId.id)) {
            return prev;
          }
          return [...prev, campaignWithId];
        });
      } else {
        // Guardar la campaña para mostrarla cuando el usuario navegue a la ruta correcta
        setPendingCampaigns((prev) => {
          // Evitar duplicados
          const existingIds = new Set(prev.map((c) => c.id));
          if (existingIds.has(campaignWithId.id)) {
            return prev;
          }
          return [...prev, campaignWithId];
        });
      }
    });

    return () => {
      socket.off("campaign_start");
    };
  }, [pathname, channelName]);

  const closeCampaign = useCallback((campaignId: string) => {
    setActiveCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    // No limpiar de pendingCampaigns para que se muestre cuando navegue a la ruta correcta
  }, []);

  return {
    activeCampaigns,
    closeCampaign,
  };
}
