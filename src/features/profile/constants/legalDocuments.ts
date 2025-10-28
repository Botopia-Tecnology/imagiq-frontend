/**
 * @module LegalDocuments
 * @description Datos de documentos legales de Samsung Colombia
 */

import {
  FileText,
  Gift,
  Smartphone,
  CreditCard,
  Refrigerator,
  Tv,
  Monitor,
} from "lucide-react";
import { DocumentCategory } from "../types/legal";

export const TERMS_CATEGORIES: DocumentCategory[] = [
  {
    id: "general",
    name: "General y Portal",
    icon: FileText,
    documents: [
      {
        id: "portal-samsung",
        title: "Portal de Samsung",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/VF_TC_del_portal_de_Samsung_111022.pdf",
      },
      {
        id: "app-movil",
        title: "Aplicación Móvil Samsung",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/tyc_20231122_TC_APP_Samsung_vf_Final_Version_12_01_2024.pdf",
      },
      {
        id: "e-voucher",
        title: "E-Voucher Legal",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/tyc_E-Voucher_Legal_03_07_2024.pdf",
      },
    ],
  },
  {
    id: "promotions-2025",
    name: "Promociones Vigentes 2025",
    icon: Gift,
    documents: [
      {
        id: "promo-para-ti",
        title: "Promo Para Ti 10%",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/15012025_15122025_tyc_EVENTO_PROMO_PARATI_10_Final_Version_2025_01_17.pdf",
        validFrom: "20250115",
        validUntil: "20251215",
      },
      {
        id: "service-for-you",
        title: "Service For You 10%",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/15012025_15122025_tyc_EVENTO_SERVICEFORYOU_10_15.01.2025_Final_Version_2025_01_17.pdf",
        validFrom: "20250115",
        validUntil: "20251215",
      },
      {
        id: "samsung-rewards",
        title: "Samsung Rewards",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250904_20260903_TYC_Samsung_Rewards_TC_II_Version_Espanol_Final_Version.pdf",
        validFrom: "20250904",
        validUntil: "20260903",
      },
      {
        id: "gift-card",
        title: "Tarjeta Regalo",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20251101_20260331_TARJETA_REGALO_2025_10_23.pdf",
        validFrom: "20251101",
        validUntil: "20260331",
      },
    ],
  },
  {
    id: "products",
    name: "Lanzamiento de Productos",
    icon: Smartphone,
    documents: [
      {
        id: "galaxy-z-fold7-flip7",
        title: "Galaxy Z Fold7/Flip7",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250814_20250827__tyc_Preventa_Z_Fold7_Z_Flip7_y_Z_Flip_FE_2025_07_31.pdf",
        validFrom: "20250814",
        validUntil: "20250827",
      },
      {
        id: "galaxy-s25-fe",
        title: "Galaxy S25 FE",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250925_20251231_tyc_Lanzamiento_S25_FE_2025_09_22.pdf",
        validFrom: "20250925",
        validUntil: "20251231",
      },
      {
        id: "tab-s11-s10-lite",
        title: "Tab S11/S10 Lite",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250911-20251009_TyC_Lanzamiento_Tab_S10_Lite.pdf",
        validFrom: "20250911",
        validUntil: "20251009",
      },
    ],
  },
  {
    id: "financing",
    name: "Financiación y Pagos",
    icon: CreditCard,
    documents: [
      {
        id: "0-interes-mercadopago",
        title: "0% Interés Mercado Pago",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250616_20251231_TyC_0percent_Inters_Mercado_Pago_20250616.pdf",
        validFrom: "20250616",
        validUntil: "20251231",
      },
      {
        id: "0-interes-davivienda",
        title: "0% Interés Banco Davivienda",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20251001_20251231_TyC_0percent_Interes_Banco_Davivienda_2025_10_08.pdf",
        validFrom: "20251001",
        validUntil: "20251231",
      },
    ],
  },
  {
    id: "home-appliances",
    name: "Electrodomésticos",
    icon: Refrigerator,
    documents: [
      {
        id: "instalacion-gratis",
        title: "Instalación + Base Gratis",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250311_20251231_tyc_INSTALACION__BASE_GRATIS_EB_Estore_2025_03_11.pdf",
        validFrom: "20250311",
        validUntil: "20251231",
      },
      {
        id: "descuento-progresivo",
        title: "Descuento Progresivo",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250701_20260101_TyC_Descuento_progresivo_HA_20250708.pdf",
        validFrom: "20250701",
        validUntil: "20260101",
      },
      {
        id: "samsung-care-ha",
        title: "Samsung Care HA",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250725_20261231tyc_Samsung_Care_HA_2025_07_31.pdf",
        validFrom: "20250725",
        validUntil: "20261231",
      },
    ],
  },
  {
    id: "audio-video",
    name: "Audio y Video",
    icon: Tv,
    documents: [
      {
        id: "select-ai-vd",
        title: "SELECT AI - VD",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20251003_20251231_V4_TyC_SELECT_AI_VD_2025_10_03.pdf",
        validFrom: "20251003",
        validUntil: "20251231",
      },
    ],
  },
  {
    id: "monitors",
    name: "Monitores",
    icon: Monitor,
    documents: [
      {
        id: "app-monitor-10",
        title: "App Monitor 10%",
        url: "https://images.samsung.com/is/content/samsung/assets/co/tyc/20250722_20251231_TyC__APP_MONITOR_10percent_20250724.pdf",
        validFrom: "20250722",
        validUntil: "20251231",
      },
    ],
  },
];

