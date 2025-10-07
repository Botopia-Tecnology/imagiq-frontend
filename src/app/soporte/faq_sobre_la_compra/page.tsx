"use client";

import { HeroFAQ } from "@/components/sections/soporte/faq/HeroFAQ";
import { FrequentQuestionsGrid } from "@/components/sections/soporte/faq/FrequentQuestionsGrid";
import { SupportBanner } from "@/components/sections/soporte/faq/SupportBanner";
import { ContactSectionFAQ } from "@/components/sections/soporte/faq/ContactSectionFAQ";
import { FAQAccordion } from "@/components/sections/soporte/faq/FAQAccordion";

export default function FaqSobreLaCompraPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroFAQ />
      <FrequentQuestionsGrid />
      <SupportBanner />
      <ContactSectionFAQ />
      <FAQAccordion />
    </div>
  );
}
