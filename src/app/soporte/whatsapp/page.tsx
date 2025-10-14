"use client";

import { HeroSection } from "@/components/sections/soporte/whatsapp/HeroSection";
import { ChatInitiationSection } from "@/components/sections/soporte/whatsapp/ChatInitiationSection";
import { ContactInfoSection } from "@/components/sections/soporte/whatsapp/ContactInfoSection";

export default function WhatsAppPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ChatInitiationSection />
      <ContactInfoSection />
    </div>
  );
}
