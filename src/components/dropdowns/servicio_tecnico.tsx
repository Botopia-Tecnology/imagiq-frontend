"use client";

import Link from "next/link";
import { 
  Wrench,
  Phone,
  FileText,
  Download,
  Shield,
  Clock,
  MessageCircle
} from "lucide-react";

export default function ServicioTecnicoDropdown() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-[900px] overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        {/* Columna izquierda - Ayuda con un producto */}
        <div className="p-6">
          <h3 className="font-semibold mb-6 text-xs uppercase tracking-wider text-gray-600">
            AYUDA CON UN PRODUCTO
          </h3>
          <ul className="space-y-4">
            <li>
              <Link 
                href="/soporte/inicio" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <Phone className="h-4 w-4 group-hover:text-blue-600" />
                <span>Inicio de soporte</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/manual-software" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <FileText className="h-4 w-4 group-hover:text-blue-600" />
                <span>Manual y Software</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/buscar" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <FileText className="h-4 w-4 group-hover:text-blue-600" />
                <span>Buscar soporte</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/faq" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <MessageCircle className="h-4 w-4 group-hover:text-blue-600" />
                <span>FAQ sobre la compra</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna central - Reparaciones y Garantía */}
        <div className="p-6">
          <h3 className="font-semibold mb-6 text-xs uppercase tracking-wider text-gray-600">
            REPARACIONES Y GARANTÍA
          </h3>
          <ul className="space-y-4">
            <li>
              <Link 
                href="/soporte/garantia" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <Shield className="h-4 w-4 group-hover:text-blue-600" />
                <span>Información de la garantía</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/reservar-reparar" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <Wrench className="h-4 w-4 group-hover:text-blue-600" />
                <span>Reservar y reparar</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/costo-reparacion" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <Clock className="h-4 w-4 group-hover:text-blue-600" />
                <span>Costo de Reparación</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna derecha - Contacto y Soporte adicional */}
        <div className="p-6">
          <h3 className="font-semibold mb-6 text-xs uppercase tracking-wider text-gray-600">
            CONTACTO
          </h3>
          <ul className="space-y-4 mb-8">
            <li>
              <Link 
                href="/soporte/whatsapp" 
                className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors group text-sm leading-relaxed"
              >
                <MessageCircle className="h-4 w-4 group-hover:text-green-600" />
                <span>WhatsApp</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/correo" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <Download className="h-4 w-4 group-hover:text-blue-600" />
                <span>Correo electrónico</span>
              </Link>
            </li>
          </ul>

          <h3 className="font-semibold mb-6 text-xs uppercase tracking-wider text-gray-600">
            SOPORTE ADICIONAL
          </h3>
          <ul className="space-y-4">
            <li>
              <Link 
                href="/soporte/noticias-alertas" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <FileText className="h-4 w-4 group-hover:text-blue-600" />
                <span>Noticias y alertas</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/soporte/comunidad" 
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group text-sm leading-relaxed"
              >
                <MessageCircle className="h-4 w-4 group-hover:text-blue-600" />
                <span>Comunidad</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
