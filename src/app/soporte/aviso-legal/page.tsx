import { Metadata } from "next";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";
import {
  AvisoLegalSection,
  CondicionesGeneralesSection,
} from "./sections/AvisoLegalContent";
import {
  ImagiqSasSection,
  InformacionTercerosSection,
} from "./sections/ImagiqSections";
import { ContactoSection } from "./sections/ContactoSection";

export const metadata: Metadata = {
  title: "Aviso Legal - IMAGIQ",
  description:
    "Aviso legal de IMAGIQ S.A.S. Términos y condiciones de uso del portal, información corporativa y políticas aplicables.",
  robots: "index, follow",
};

const sections = [
  { id: "aviso-legal", title: "Aviso Legal", level: 1 },
  {
    id: "condiciones-generales",
    title: "Condiciones Generales de Uso",
    level: 1,
  },
  { id: "imagiq-sas", title: "IMAGIQ S.A.S.", level: 1 },
  {
    id: "informacion-terceros",
    title: "Información y Sitios Web de Terceros",
    level: 1,
  },
  { id: "contacto", title: "Contacto", level: 1 },
];

export default function AvisoLegalPage() {
  return (
    <LegalDocumentLayout
      title="Aviso Legal"
      sections={sections}
      documentType="Aviso Legal"
      lastUpdated="Enero 2025"
    >
      <div className="space-y-8">
        <AvisoLegalSection />
        <CondicionesGeneralesSection />
        <ImagiqSasSection />
        <InformacionTercerosSection />
        <ContactoSection />
      </div>
    </LegalDocumentLayout>
  );
}
