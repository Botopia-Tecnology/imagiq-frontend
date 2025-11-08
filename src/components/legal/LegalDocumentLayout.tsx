"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home, Menu, X } from "lucide-react";

interface Section {
  id: string;
  title: string;
  level: number;
}

interface LegalDocumentLayoutProps {
  title: string;
  sections: Section[];
  children: React.ReactNode;
  documentType?: string;
  lastUpdated?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function LegalDocumentLayout({
  title,
  sections,
  children,
  documentType = "Documento Legal",
  lastUpdated,
  breadcrumbs = [],
}: LegalDocumentLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="h-16 flex items-center justify-between px-6 lg:px-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-black transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <Link href="/soporte/inicio_de_soporte" className="text-gray-500 hover:text-black transition-colors">
              Soporte
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="w-3 h-3 text-gray-300" />
                <Link href={crumb.href} className="text-gray-500 hover:text-black transition-colors">
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar de navegación */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 z-30 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="p-6 lg:p-8">
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                {documentType}
              </div>
              <h1 className="text-xl font-bold text-black leading-tight">{title}</h1>
              {lastUpdated && (
                <div className="text-xs text-gray-500 mt-2">
                  Actualizado: {lastUpdated}
                </div>
              )}
            </div>

            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      w-full text-left text-sm py-2.5 px-3 rounded-lg transition-all duration-200
                      ${isActive
                        ? "bg-black text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                      ${section.level > 1 ? "pl-6 text-xs" : ""}
                    `}
                  >
                    <div className="flex items-center">
                      {section.level === 1 && (
                        <span className="w-1 h-1 rounded-full bg-current mr-2.5" />
                      )}
                      {section.title}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 min-w-0">
          <article className="w-full px-8 lg:px-16 xl:px-24 py-12 lg:py-16">
            <div className="max-w-full">
              {children}
            </div>
          </article>

          {/* Footer */}
          <footer className="border-t border-gray-200 mt-16">
            <div className="w-full px-8 lg:px-16 xl:px-24 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500">
                <div>
                  <p className="font-medium text-black">IMAGIQ S.A.S.</p>
                  <p>NIT 900.565.091-1</p>
                  <p>Calle 98 #8-28 Of 204, Bogotá D.C.</p>
                </div>
                <div className="text-right">
                  <Link
                    href="/soporte/inicio_de_soporte"
                    className="text-black hover:underline font-medium"
                  >
                    Volver a Soporte
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
