"use client"

import { useState, useEffect } from "react"
import { useDeviceType } from "@/components/responsive"
import { useLogos } from "@/hooks/useLogos"

export default function HeaderStep1() {
  const device = useDeviceType()
  const [isScrolled, setIsScrolled] = useState(false)

  // Usar el hook de logos (igual que useDynamicBanner o useHeroBanner)
  const { logoDark, logoLight, loading, error } = useLogos()

  // Debug: Log cuando cambien los logos
  useEffect(() => {
    console.log('🎨 [HeaderStep1] Logo oscuro:', logoDark?.image_url || 'No cargado')
    console.log('🎨 [HeaderStep1] Logo claro:', logoLight?.image_url || 'No cargado')
    console.log('🎨 [HeaderStep1] Loading:', loading)
    console.log('🎨 [HeaderStep1] Error:', error)
  }, [logoDark, logoLight, loading, error])

  // Detectar scroll para cambiar el fondo en desktop
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Determinar qué logo mostrar según el fondo
  const getLogoToDisplay = () => {
    // Mobile y tablet: fondo negro -> usar logo claro
    if (device === "mobile" || device === "tablet") {
      return logoLight?.image_url || "/imagiq-logo-light.png"
    }

    // Desktop: si hay scroll o fondo oscuro -> logo claro, si no -> logo oscuro
    if (isScrolled) {
      return logoLight?.image_url || "/imagiq-logo-light.png"
    }

    return logoDark?.image_url || "/imagiq-logo-dark.png"
  }

  // Ejemplo de clases responsive para header y elementos
  const headerClasses =
    device === "mobile"
      ? "w-full flex items-center justify-between px-2 py-2 fixed top-0 left-0 z-50 bg-black transition-all duration-300"
      : device === "tablet"
      ? "w-full flex items-center justify-between px-4 py-4 fixed top-0 left-0 z-50 bg-black transition-all duration-300"
      : `w-full flex items-center justify-between px-8 py-6 fixed top-0 left-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black shadow-lg" : "bg-transparent"
        }`

  const iconsClasses =
    device === "mobile"
      ? "flex items-center gap-2"
      : device === "tablet"
      ? "flex items-center gap-4"
      : "flex items-center gap-6"

  const buttonClasses =
    device === "mobile"
      ? "text-white text-base hover:text-gray-300"
      : device === "tablet"
      ? "text-white text-lg hover:text-gray-300"
      : "text-white text-xl hover:text-gray-300"

  const logoSize = device === "mobile" ? 32 : device === "tablet" ? 40 : 48
  const logoClasses =
    device === "mobile"
      ? "text-white font-bold text-lg tracking-widest select-none"
      : device === "tablet"
      ? "text-white font-bold text-xl tracking-widest select-none"
      : "text-white font-bold text-2xl tracking-widest select-none"

  return (
    <header className={headerClasses}>
      {/* Logo ImagIQ + Texto SAMSUNG */}
      <div className="flex items-center gap-2">
        {/* Logo circular de ImagIQ (dinámico según fondo) - Renderizado NATIVO como los banners */}
        <img
          src={getLogoToDisplay()}
          alt="ImagIQ Logo"
          width={logoSize}
          height={logoSize}
          className="object-contain rounded-full"
          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
        />

        {/* Texto SAMSUNG */}
        <span className={logoClasses}>SAMSUNG</span>
      </div>

      {/* Iconos derecha */}
      <div className={iconsClasses}>
        {/* Buscar */}
        <button className={buttonClasses} aria-label="Buscar">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {/* Carrito */}
        <button className={buttonClasses} aria-label="Carrito">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="9" cy="20" r="1" fill="currentColor" />
            <circle cx="17" cy="20" r="1" fill="currentColor" />
            <path d="M5 6h2l1 7h9l1-5H7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Usuario */}
        <button className={buttonClasses} aria-label="Usuario">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </header>
  )
}
