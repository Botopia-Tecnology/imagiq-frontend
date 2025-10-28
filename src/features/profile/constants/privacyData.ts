/**
 * @module PrivacyData
 * @description Datos de la política de privacidad de Samsung Colombia
 */

import {
  Shield,
  Users,
  Lock,
  Globe,
  FileText,
  Mail,
} from "lucide-react";

export interface PrivacySection {
  id: string;
  title: string;
  icon: React.ElementType;
}

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "intro",
    title: "Introducción y Alcance",
    icon: Shield,
  },
  {
    id: "info-collection",
    title: "Qué Información Recopilamos",
    icon: FileText,
  },
  {
    id: "use",
    title: "Cómo Utilizamos su Información",
    icon: Users,
  },
  {
    id: "rights",
    title: "Sus Derechos como Titular",
    icon: Lock,
  },
  {
    id: "sharing",
    title: "Compartir Información",
    icon: Globe,
  },
  {
    id: "contact",
    title: "Contacto y Procedimientos",
    icon: Mail,
  },
];

export const DATA_TYPES = [
  "Datos generales y específicos de identificación",
  "Datos biométricos",
  "Datos de ubicación",
  "Datos de salud",
  "Datos financieros y crediticios",
  "Datos tributarios",
  "Historia laboral y educativa",
  "Información de seguridad social",
  "Antecedentes judiciales",
  "Acceso a sistemas (usuarios, IP, claves)",
  "Gustos e intereses",
];

export const USER_RIGHTS = [
  {
    title: "Acceso",
    desc: "Conocer sus datos personales en poder de Samsung",
  },
  {
    title: "Actualización",
    desc: "Actualizar datos incompletos o fraccionados",
  },
  {
    title: "Rectificación",
    desc: "Corregir datos erróneos o inexactos",
  },
  {
    title: "Supresión",
    desc: "Solicitar eliminación de datos cuando no haya exigencia legal",
  },
  {
    title: "Revocación",
    desc: "Revocar autorización sin incumplir obligaciones legales",
  },
];
