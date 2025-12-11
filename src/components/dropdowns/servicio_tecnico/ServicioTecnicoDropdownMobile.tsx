"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SERVICIO_TECNICO_MENU_ITEMS } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export default function ServicioTecnicoDropdownMobile({ onItemClick }: Props) {
  const router = useRouter();

  return (
    <div className="bg-gray-50 px-4 py-3">
      <div className="space-y-2">
        {SERVICIO_TECNICO_MENU_ITEMS.map((item) => {
          const IconComponent = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onItemClick(item.title, item.href);
                router.push(item.href);
              }}
              className="block text-left w-full"
            >
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors active:bg-gray-200">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
