import React from "react";
import {
  School,
  Landmark,
  Briefcase,
  Wrench,
} from "lucide-react";

interface IconProps {
  className?: string;
}

// Educativo: School (edificio escolar)
export const EducativoIcon: React.FC<IconProps> = ({
  className = "w-8 h-8",
}) => <School className={className} strokeWidth={2} />;

export const RetailIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const FinancieroIcon: React.FC<IconProps> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// Gobierno: Landmark (monumento/edificio institucional)
export const GobiernoIcon: React.FC<IconProps> = ({
  className = "w-8 h-8",
}) => <Landmark className={className} strokeWidth={2} />;

export const HoteleroIcon: React.FC<IconProps> = ({
  className = "w-8 h-8",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v.01" />
    <path d="M9 12v.01" />
    <path d="M9 15v.01" />
    <path d="M9 18v.01" />
  </svg>
);

// Consultas de ventas: Briefcase (maletín profesional)
export const SalesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <Briefcase className={className} strokeWidth={2} />
);

// Soporte técnico: Wrench (herramienta/llave inglesa)
export const SupportIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <Wrench className={className} strokeWidth={2} />
);
