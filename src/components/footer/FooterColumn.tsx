/**
 * FooterColumn Component
 * Columna individual del footer con título y enlaces
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import type { FooterSection } from "./footer-config";

interface FooterColumnProps {
  readonly section: FooterSection;
  readonly index: number;
  readonly isVisible: boolean;
}

export function FooterColumn({ section, index, isVisible }: FooterColumnProps) {
  // Estado para acordeón principal
  const [isExpanded, setIsExpanded] = useState(false);
  // Estados para subsecciones (cuando no hay título principal)
  const [expandedSubsections, setExpandedSubsections] = useState<Record<string, boolean>>({});

  const handleLinkClick = (linkName: string, href: string) => {
    posthogUtils.capture("footer_link_click", {
      section: section.title,
      link: linkName,
      href,
    });
  };

  const toggleSubsection = (subsectionTitle: string) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [subsectionTitle]: !prev[subsectionTitle],
    }));
  };

  // Renderizar enlaces de una sección o subsección
  const renderLinks = (links: typeof section.links, className = "") => (
    <ul className={className}>
      {links?.map((link, linkIndex) => (
        <li
          key={link.name}
          className={`transition-all duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: `${index * 100 + linkIndex * 30}ms` }}
        >
          <Link
            href={link.href}
            className="text-base text-gray-600 hover:text-blue-600 hover:underline transition-colors inline-block"
            onClick={() => handleLinkClick(link.name, link.href)}
            {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
          >
            {link.name}
            {link.external && " ↗"}
          </Link>
        </li>
      ))}
    </ul>
  );

  // Renderizar enlaces para mobile
  const renderMobileLinks = (links: typeof section.links) => (
    <>
      {links?.map((link) => (
        <li key={link.name} className="border-b border-gray-100 last:border-b-0">
          <Link
            href={link.href}
            className="block text-base text-gray-600 hover:text-blue-600 py-3 px-4 transition-colors"
            onClick={() => handleLinkClick(link.name, link.href)}
            {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
          >
            {link.name}
            {link.external && " ↗"}
          </Link>
        </li>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile: Accordion */}
      <div className="md:hidden border-b border-gray-200">
        {section.title ? (
          <>
            <button
              type="button"
              className="w-full flex justify-between items-center py-4 px-4 text-left text-base font-semibold text-gray-900"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              <span>{section.title}</span>
              <span
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              >
                ▾
              </span>
            </button>
            <ul
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? "max-h-[1000px] py-2" : "max-h-0"
              }`}
            >
              {section.subsections ? (
                <>
                  {section.subsections.map((subsection) => (
                    <li key={subsection.title} className="mb-4">
                      <h4 className="font-bold text-gray-900 text-sm px-4 mb-2">
                        {subsection.title}
                      </h4>
                      <ul>
                        {renderMobileLinks(subsection.links)}
                      </ul>
                    </li>
                  ))}
                </>
              ) : (
                renderMobileLinks(section.links)
              )}
            </ul>
          </>
        ) : (
          // Si no hay título, mostrar subsecciones directamente como acordeones separados
          <div>
            {section.subsections?.map((subsection, subIndex) => {
              const isSubExpanded = expandedSubsections[subsection.title] || false;
              return (
                <div key={subsection.title} className={subIndex > 0 ? "border-t border-gray-200" : ""}>
                  <button
                    type="button"
                    className="w-full flex justify-between items-center py-4 px-4 text-left text-base font-semibold text-gray-900"
                    onClick={() => toggleSubsection(subsection.title)}
                    aria-expanded={isSubExpanded}
                  >
                    <span>{subsection.title}</span>
                    <span
                      className={`transition-transform duration-200 ${
                        isSubExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  <ul
                    className={`overflow-hidden transition-all duration-300 ${
                      isSubExpanded ? "max-h-[1000px] py-2" : "max-h-0"
                    }`}
                  >
                    {renderMobileLinks(subsection.links)}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: Column */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        {section.title && (
          <h3 className="font-bold text-gray-900 text-lg mb-4">
            {section.title}
          </h3>
        )}

        {section.subsections ? (
          <div className="space-y-6">
            {section.subsections.map((subsection) => (
              <div key={subsection.title}>
                <h4 className="font-bold text-gray-900 text-lg mb-4">
                  {subsection.title}
                </h4>
                {renderLinks(subsection.links, "space-y-2")}
              </div>
            ))}
          </div>
        ) : (
          renderLinks(section.links, "space-y-2")
        )}
      </div>
    </>
  );
}
