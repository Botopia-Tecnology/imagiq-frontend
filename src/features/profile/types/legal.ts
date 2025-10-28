/**
 * @module LegalTypes
 * @description Tipos para documentación legal
 */

import { LucideIcon } from "lucide-react";

export interface LegalDocument {
  id: string;
  title: string;
  url: string;
  validFrom?: string;
  validUntil?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  documents: LegalDocument[];
}

export type LegalDocumentType = "terms" | "privacy";
