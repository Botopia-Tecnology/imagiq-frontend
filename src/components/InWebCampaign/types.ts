export interface CampaignData {
  campaign_name?: string;
  campaign_type?: string;
  content_type?: "image" | "html";
  content_url?: string; // link de redirección
  display_style?: "modal" | "slider";
  html_content?: string | null;
  image_url?: string; // imagen del contenido
  preview_url?: string; // rutas donde debe mostrarse la campaña: "*" para todas, ruta exacta (ej: "/"), o wildcard (ej: "/productos/*")
  ttl?: number;
  urgency?: string;
  url?: string; // @deprecated - usar preview_url en su lugar
}
