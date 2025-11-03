"use client";

// Using relative paths to avoid any path alias resolution issues in some TS setups
import { HeroNoticias } from "../../../components/sections/soporte/noticias/HeroNoticias";
import { NoticiasGrid } from "../../../components/sections/soporte/noticias/NoticiasGrid";
import { ContactSectionNoticias } from "../../../components/sections/soporte/noticias/ContactSectionNoticias";

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroNoticias />
      <NoticiasGrid />
      <ContactSectionNoticias />
    </div>
  );
}