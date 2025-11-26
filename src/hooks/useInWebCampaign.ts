import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { connectSocket } from "@/lib/socket";
import type { CampaignData } from "@/components/InWebCampaign/types";

interface UseInWebCampaignOptions {
  channelName?: string; // Nombre del canal (por defecto "inweb")
}

/**
 * Hook para gestionar campañas InWeb desde socket
 *
 * La validación de rutas se hace según el campo `url` que viene en el evento:
 * - Si `url` es "*" o undefined, se muestra en todas las rutas
 * - Si `url` es una ruta específica, solo se muestra en esa ruta
 *
 */
export function useInWebCampaign(
  options: UseInWebCampaignOptions = {}
) {
  const { channelName = "inweb" } = options;
  const pathname = usePathname();
  console.log(pathname)
  const [activeCampaign, setActiveCampaign] = useState<CampaignData | null>(null);

  useEffect(() => {
    console.log("🔌 Conectando socket para campañas InWeb...");
    const socket = connectSocket(channelName);

    console.log("👂 Escuchando evento 'campaign_start'");

    socket.on("campaign_start", (msg: CampaignData) => {
      console.log("📨 Evento 'campaign_start' recibido:", msg);

      // Validar si la campaña debe mostrarse en la ruta actual
      const campaignUrl = msg.url;
      const shouldShow =
        !campaignUrl || // Si no tiene url, mostrar en todas
        campaignUrl === "*" || // Si es "*", mostrar en todas
        pathname === campaignUrl; // Si coincide con la ruta actual

      if (!shouldShow) {
        console.log("⛔ Campaña ignorada - ruta actual:", pathname, "- ruta campaña:", campaignUrl);
        return;
      }

      console.log("✅ Mostrando campaña en ruta:", pathname);
      setActiveCampaign(msg);
    });

    // Listener para debug (opcional)
    socket.onAny((eventName, ...args) => {
      console.log("📡 Evento socket recibido:", eventName, args);
    });

    return () => {
      console.log("🧹 Limpiando listeners de socket InWeb");
      socket.off("campaign_start");
      socket.offAny();
    };
  }, [pathname, channelName]);

  const closeCampaign = () => setActiveCampaign(null);

  return {
    activeCampaign,
    closeCampaign,
  };
}
