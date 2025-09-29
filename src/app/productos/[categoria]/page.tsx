"use client";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import { CategoriaParams } from "./types";

const categorias: CategoriaParams[] = ["electrodomestico", "moviles", "tvs"];

export default function Page({
  params,
}: Readonly<{ params: Promise<{ categoria: CategoriaParams }> }>) {
  const { categoria } = use(params);
  const searchParams = useSearchParams();
  const seccion = searchParams.get("section");

  if (!categorias.includes(categoria)) {
    return (
      <main className="px-8">
        <h1>Error, la categoria {categoria} no existe</h1>
      </main>
    );
  }

  return (
    <main className="px-8">
      <h1>
        Hola, estás en la sección {seccion} de la categoria {categoria}
      </h1>
    </main>
  );
}
