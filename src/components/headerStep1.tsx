import { useDeviceType } from "@/components/responsive";

export default function HeaderStep1() {
  const device = useDeviceType();

  // Ejemplo de clases responsive para header y elementos
  const headerClasses =
    device === "mobile"
      ? "w-full flex items-center justify-between px-2 py-2 fixed top-0 left-0 z-50 bg-black"
      : device === "tablet"
      ? "w-full flex items-center justify-between px-4 py-4 fixed top-0 left-0 z-50 bg-black"
      : "w-full flex items-center justify-between px-8 py-6 fixed top-0 left-0 z-50 bg-transparent";

  const logoClasses =
    device === "mobile"
      ? "text-white font-bold text-lg tracking-widest select-none"
      : device === "tablet"
      ? "text-white font-bold text-xl tracking-widest select-none"
      : "text-white font-bold text-2xl tracking-widest select-none";

  const iconsClasses =
    device === "mobile"
      ? "flex items-center gap-2"
      : device === "tablet"
      ? "flex items-center gap-4"
      : "flex items-center gap-6";

  const buttonClasses =
    device === "mobile"
      ? "text-white text-base hover:text-gray-300"
      : device === "tablet"
      ? "text-white text-lg hover:text-gray-300"
      : "text-white text-xl hover:text-gray-300";

  return (
    <header className={headerClasses}>
      {/* Logo Samsung */}
      <span className={logoClasses}>SAMSUNG</span>
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
  );
}