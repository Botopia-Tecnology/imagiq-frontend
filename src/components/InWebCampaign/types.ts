export interface CampaignData {
  campaign_name?: string;
  campaign_type?: string;
  content_type?: "image" | "html";
  content_url?: string; // link de redirección
  display_style?: "modal" | "slider";
  html_content?: string | null;
  image_url?: string; // imagen del contenido
  preview_url?: string;
  ttl?: number;
  urgency?: string;
  url?: string; // ruta donde debe mostrarse la campaña ("*" para todas, o ruta específica)
}
