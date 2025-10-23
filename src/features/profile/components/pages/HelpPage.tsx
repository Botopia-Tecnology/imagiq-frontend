/**
 * @module HelpPage
 * @description Samsung-style help and support page - optimized (<200 lines)
 */

import React, { useState } from "react";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import PageHeader from "../layouts/PageHeader";
import SearchBar from "../help/SearchBar";
import CategoryCard from "../help/CategoryCard";
import FAQItem from "../help/FAQItem";
import ContactOption from "../help/ContactOption";
import HelpResources from "../help/HelpResources";
import { helpCategories, faqs } from "../help/helpData";

interface HelpPageProps {
  onBack?: () => void;
  className?: string;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBack, className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <PageHeader
        title="Centro de Ayuda"
        subtitle="Encuentra respuestas a tus preguntas"
        onBack={onBack}
      />

      <div className="max-w-6xl mx-auto px-4 pb-8 space-y-8 mt-10">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Help Categories */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Categorías de Ayuda
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>

        {/* Frequent Questions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Preguntas Frecuentes
          </h2>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-5 py-3 rounded-xl text-sm font-bold transition-all flex-shrink-0 border-2",
                  selectedCategory === "all"
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-900 border-gray-200 hover:border-black"
                )}
              >
                Todas
              </button>
              {helpCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-5 py-3 rounded-xl text-sm font-bold transition-all flex-shrink-0 border-2",
                    selectedCategory === category.id
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-900 border-gray-200 hover:border-black"
                  )}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openFAQ === faq.id}
                  onToggle={() =>
                    setOpenFAQ(openFAQ === faq.id ? null : faq.id)
                  }
                />
              ))
            ) : (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center">
                <HelpCircle
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No se encontraron preguntas
                </h3>
                <p className="text-sm text-gray-600">
                  Intenta con términos de búsqueda diferentes o contacta nuestro
                  soporte
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Necesitas más ayuda?
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ContactOption
              title="Chat en Vivo"
              description="Chatea con nuestro equipo de soporte"
              icon={MessageCircle}
              action="Iniciar Chat"
              available="Lun-Vie 8am-6pm"
              onClick={() => console.log("Open chat")}
            />
            <ContactOption
              title="Llamar"
              description="Habla directamente con un asesor"
              icon={Phone}
              action="Llamar Ahora"
              available="Lun-Vie 8am-6pm"
              onClick={() => console.log("Call support")}
            />
            <ContactOption
              title="Email"
              description="Envía tu consulta por correo"
              icon={Mail}
              action="Enviar Email"
              available="Respuesta en 24h"
              onClick={() => console.log("Email support")}
            />
          </div>
        </div>

        {/* Additional Resources */}
        <HelpResources />
      </div>
    </div>
  );
};

HelpPage.displayName = "HelpPage";

export default HelpPage;
