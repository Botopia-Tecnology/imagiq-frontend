"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  id: string;
  name: string;
  href: string;
}

export default function MyPageSubHeader() {
  const pathname = usePathname();
  
  const tabs: Tab[] = [
    { id: "inicio", name: "Inicio de Mi página", href: "/perfil" },
    { id: "productos", name: "Mis productos", href: "/perfil/productos" },
    { id: "recompensas", name: "Mis recompensas", href: "/perfil/recompensas" },
    { id: "pedidos", name: "Mis pedidos", href: "/perfil/pedidos" },
    { id: "cupones", name: "Mis cupones", href: "/perfil/cupones" },
    { id: "reparacion", name: "Mi reparación", href: "/soporte/reservar-reparar" }
  ];

  const isActiveTab = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="bg-white sticky top-[40px] z-[5] shadow-sm border-b border-gray-200" style={{ marginTop: '-10px' }}>
      {/* Línea superior delgada */}
      <div className="border-t border-gray-300"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-8 bg-white" style={{ marginLeft: '0px', paddingLeft: '230px' }}>
        <h1 className="text-lg font-semibold text-gray-900 py-1 text-left bg-white ml-0 pl-0">Mi página</h1>
        
        <nav className="flex space-x-0 -ml-6 bg-white">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-4 py-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap bg-white ${
                isActiveTab(tab.href)
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Línea inferior delgada */}
      <div className="border-b border-gray-300 bg-white"></div>
    </div>
  );
}
