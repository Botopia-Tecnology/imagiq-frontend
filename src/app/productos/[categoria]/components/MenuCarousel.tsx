"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Menu } from "@/lib/api";
import SeriesSlider from "./SeriesSlider";
import type { SeriesItem } from "../config/series-configs";
import { toSlug } from "../utils/slugUtils";

interface Props {
  readonly menus: Menu[];
  readonly categoria: string;
  readonly title?: string;
}

export default function MenuCarousel({ menus, categoria, title }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const series: SeriesItem[] = useMemo(() => {
    return menus.map(menu => ({
      id: menu.uuid,
      name: menu.nombreVisible || menu.nombre,
      image: menu.imagen || undefined,
    }));
  }, [menus]);

  const handleMenuClick = (menuUuid: string) => {
    const menu = menus.find(m => m.uuid === menuUuid);
    if (!menu) return;
    const menuSlug = toSlug(menu.nombreVisible || menu.nombre);
    const currentParams = new URLSearchParams(searchParams?.toString());
    currentParams.set('seccion', menuSlug);
    currentParams.delete('submenu');
    const newUrl = `${pathname}?${currentParams.toString()}`;
    router.push(newUrl);
  };

  const activeFilters = { serie: [] as string[] };

  if (!series.length) return null;

  return (
    <section>
      <div className="">
        <h1
          className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black py-4 sm:mb-6 md:mb-8 lg:mb-10"
          style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
        >
          {title}
        </h1>

        <SeriesSlider
          series={series}
          activeFilters={activeFilters}
          onSerieClick={handleMenuClick}
        />
      </div>
    </section>
  );
}


