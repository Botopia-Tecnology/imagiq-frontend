export default function HeaderStep1() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-6 fixed top-0 left-0 z-50 bg-transparent">
      {/* Logo Samsung */}
      <span className="text-white font-bold text-2xl tracking-widest select-none">
        SAMSUNG
      </span>
      {/* Iconos derecha */}
      <div className="flex items-center gap-6">
        {/* Buscar */}
        <button className="text-white text-xl hover:text-gray-300" aria-label="Buscar">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        {/* Carrito */}
        <button className="text-white text-xl hover:text-gray-300" aria-label="Carrito">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1" fill="currentColor"/><circle cx="17" cy="20" r="1" fill="currentColor"/><path d="M5 6h2l1 7h9l1-5H7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>
        </button>
        {/* Usuario */}
        <button className="text-white text-xl hover:text-gray-300" aria-label="Usuario">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
      </div>
    </header>
  );
}