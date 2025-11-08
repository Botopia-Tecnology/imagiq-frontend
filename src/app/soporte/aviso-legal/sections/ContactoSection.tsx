/**
 * Sección de contacto para Aviso Legal
 */

import {
  LegalH2,
  LegalParagraph,
  LegalInfoCard,
} from "@/components/legal/LegalComponents";

export function ContactoSection() {
  return (
    <section id="contacto">
      <LegalH2>CONTACTO</LegalH2>
      <LegalParagraph className="mb-4">
        En caso de requerir ponerse en contacto con IMAGIQ, ponemos a su
        disposición las siguientes direcciones y mecanismos de contacto:
      </LegalParagraph>
      <LegalInfoCard className="space-y-3">
        <div className="flex items-start">
          <span className="font-semibold text-gray-900 min-w-[120px]">
            Correo electrónico:
          </span>
          <a
            href="mailto:PQRSAMCOL@IMAGIQ.CO"
            className="text-gray-900 hover:text-gray-600 underline"
          >
            PQRSAMCOL@IMAGIQ.CO
          </a>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-900 min-w-[120px]">
            Canales de atención:
          </span>
          <span className="text-gray-700">
            WhatsApp{" "}
            <a
              href="https://wa.me/573228639389"
              className="text-gray-900 hover:text-gray-600 underline"
            >
              +57 322 8639389
            </a>{" "}
            o{" "}
            <a
              href="tel:+576017441176"
              className="text-gray-900 hover:text-gray-600 underline"
            >
              (601) 7441176
            </a>
          </span>
        </div>
        <div className="flex items-start">
          <span className="font-semibold text-gray-900 min-w-[120px]">
            Portal:
          </span>
          <a
            href="https://imagiq.com/"
            className="text-gray-900 hover:text-gray-600 underline"
          >
            https://imagiq.com/
          </a>
        </div>
      </LegalInfoCard>
    </section>
  );
}
