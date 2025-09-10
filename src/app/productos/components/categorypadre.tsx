import React, { useState } from "react";
import CategorySlider from "./CategorySlider";
import ProductCard from "./ProductCard";
import { productsData } from "../data_product/products";
import smartphonesImg from "@/img/categorias/Smartphones.png";
import tabletasImg from "@/img/categorias/Tabletas.png";
import galaxyWatchImg from "@/img/categorias/galaxy_watch.png";
import galaxyBudsImg from "@/img/categorias/galaxy_buds.png";

// Define las categorías que quieres mostrar en el slider
const categories = [
  {
    id: "smartphones-tablets",
    name: "Galaxy Smartphone",
    subtitle: "Smartphone",
    image: smartphonesImg,
    href: "#smartphones-tablets",
  },
  {
    id: "galaxy-watch",
    name: "Galaxy Watch",
    subtitle: "Watch",
    image: galaxyWatchImg,
    href: "#galaxy-watch",
  },
  {
    id: "galaxy-tab",
    name: "Galaxy Tab",
    subtitle: "Tab",
    image: tabletasImg,
    href: "#galaxy-tab",
  },
  {
    id: "galaxy-buds",
    name: "Galaxy Buds",
    subtitle: "Buds",
    image: galaxyBudsImg,
    href: "#galaxy-buds",
  },
];

export default function ProductosPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0].id);

  // Filtra los productos según la categoría seleccionada
  const filteredProducts = productsData[selectedCategoryId] || [];

  return (
    <div>
      <CategorySlider
        categories={categories}
        activeCategoryId={selectedCategoryId}
        onCategoryClick={cat => setSelectedCategoryId(cat.id)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}