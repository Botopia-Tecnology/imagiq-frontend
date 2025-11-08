/**
 * Tipos para componentes legales
 */

export interface LegalTableRow {
  id?: string;
  cells: React.ReactNode[];
}

export interface LegalTableProps {
  caption: string;
  headers: string[];
  rows: LegalTableRow[];
  className?: string;
}

export interface LegalContactItem {
  label: string;
  value: React.ReactNode;
}

export interface LegalDocumentFooterProps {
  code?: string;
  version?: string;
  date?: string;
}

export interface LegalComponentProps {
  children: React.ReactNode;
  className?: string;
}

export interface LegalHeadingProps {
  children: React.ReactNode;
  id?: string;
}

export interface LegalNumberedCardProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

export interface LegalWarningProps {
  title?: string;
  children: React.ReactNode;
}

export interface LegalHighlightProps {
  children: React.ReactNode;
  variant?: "gray" | "yellow";
}
