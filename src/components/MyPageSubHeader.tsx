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
    { id: "inicio", name: "Inicio de Mi página", href: "/soporte/reservar-reparar/mi_cuenta" },
    { id: "productos", name: "Mis productos", href: "/soporte/reservar-reparar/productos" },
    { id: "recompensas", name: "Mis recompensas", href: "/soporte/reservar-reparar/recompensas" },
    { id: "pedidos", name: "Mis pedidos", href: "/soporte/reservar-reparar/pedidos" },
    { id: "cupones", name: "Mis cupones", href: "/soporte/reservar-reparar/cupones" },
    { id: "reparacion", name: "Mi reparación", href: "/soporte/reservar-reparar" }
  ];

  const isActiveTab = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="bg-white sticky top-[0px] z-[5]" style={{ marginTop: '-60px' }}>
      {/* Línea superior divisoria */}
      <div className="border-t border-gray-300"></div>
      
      <div className="w-full bg-white" style={{ paddingLeft: '240px', paddingRight: '185px' }}>
        <div className="py-5 border-b border-gray-300">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Mi página</h2>
          
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`pb-4 text-sm font-normal border-b-2 transition-all duration-200 whitespace-nowrap ${
                  isActiveTab(tab.href)
                    ? "border-blue-500 text-blue-500 font-medium"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Línea inferior divisoria */}
      <div className="border-b border-gray-300"></div>
    </div>
  );
}
