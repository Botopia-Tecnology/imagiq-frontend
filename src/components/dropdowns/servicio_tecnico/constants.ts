import { FileSearch, CreditCard, MapPin, MessageCircle, LucideIcon } from "lucide-react";

export interface ServicioTecnicoMenuItem {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const SERVICIO_TECNICO_MENU_ITEMS: ServicioTecnicoMenuItem[] = [
  {
    title: "Consulta tu orden de servicio",
    description: "Revisa el estado de tu orden de reparación",
    href: "/soporte/inicio_de_soporte",
    icon: FileSearch,
  },
  {
    title: "Paga tu orden de servicio",
    description: "Realiza el pago de tu servicio técnico",
    href: "/soporte/inicio_de_soporte",
    icon: CreditCard,
  },
  {
    title: "Puntos de soporte",
    description: "Encuentra nuestros centros de servicio",
    href: "/tiendas",
    icon: MapPin,
  },
  {
    title: "Contacto",
    description: "Comunícate con nuestro equipo de soporte",
    href: "/soporte/whatsapp",
    icon: MessageCircle,
  },
];
