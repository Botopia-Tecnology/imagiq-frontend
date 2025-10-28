/**
 * @module GlobalPolicyAccordion
 * @description Secciones acordeón de la Política Global de Samsung
 */

import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Section1Content,
  Section2Content,
  Section3Content,
  Section4Content,
  Section5Content,
  Section6Content,
  Section7Content,
  Section8Content,
  Section9Content,
  Section10Content
} from "./global-sections";

interface GlobalPolicyAccordionProps {
  expandedSection: number | null;
  onToggle: (index: number) => void;
}

const sections = [
  { id: 1, title: "¿Cuáles son las informaciones recopiladas?", Component: Section1Content },
  { id: 2, title: "¿Cómo utilizamos sus informaciones?", Component: Section2Content },
  { id: 3, title: "¿Con quién compartimos sus informaciones?", Component: Section3Content },
  { id: 4, title: "¿Cómo mantenemos sus informaciones protegidas?", Component: Section4Content },
  { id: 5, title: "¿A dónde enviamos sus datos?", Component: Section5Content },
  { id: 6, title: "¿Cuáles son sus derechos?", Component: Section6Content },
  { id: 7, title: "¿Cuánto tiempo mantenemos sus informaciones?", Component: Section7Content },
  { id: 8, title: "¿Qué servicios usamos de terceros?", Component: Section8Content },
  { id: 9, title: "Cookies, beacons y tecnologías similares", Component: Section9Content },
  { id: 10, title: "Póngase en contacto con nosotros", Component: Section10Content }
];

const GlobalPolicyAccordion: React.FC<GlobalPolicyAccordionProps> = ({
  expandedSection,
  onToggle
}) => {
  return (
    <div className="space-y-2">
      {sections.map(({ id, title, Component }) => {
        const isExpanded = expandedSection === id;
        return (
          <div key={id} className="border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onToggle(id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-400">¿</span>
                <h3 className="font-semibold text-gray-900">{title}</h3>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
              )}
            </button>
            {isExpanded && (
              <div className="p-6 bg-white border-t border-gray-200">
                <Component />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GlobalPolicyAccordion;
