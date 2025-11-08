/**
 * Componentes reutilizables para páginas legales
 * Exporta todos los componentes desde archivos modulares
 */

// Tipos
export type {
  LegalTableRow,
  LegalTableProps,
  LegalContactItem,
  LegalDocumentFooterProps,
  LegalComponentProps,
  LegalHeadingProps,
  LegalNumberedCardProps,
  LegalWarningProps,
  LegalHighlightProps,
} from "./types";

// Componentes de texto
export { LegalParagraph, LegalH2, LegalH3, LegalH4 } from "./TextComponents";

// Componentes de tabla
export { LegalTable } from "./TableComponent";

// Componentes de contenedores
export {
  LegalInfoCard,
  LegalWarning,
  LegalHighlight,
} from "./ContainerComponents";

// Componentes de listas
export { LegalList, LegalNumberedCard } from "./ListComponents";

// Componentes de footer y contacto
export { LegalContactInfo, LegalDocumentFooter } from "./FooterComponents";
