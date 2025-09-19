// /**
//  * 🎴 ExploreProduct - IMAGIQ ECOMMERCE
//  *
//  * Componente reutilizable para mostrar productos a explorar:
//  * - Botones de acción (Compra aquí, Conoce mas)
//  * - Responsive design
//  */

// "use client";

// import { useState } from "react";
// import { useCartContext } from "@/features/cart/CartContext";
// import { useRouter } from "next/navigation";
// import Image, { StaticImageData } from "next/image";
// import { Heart } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { posthogUtils } from "@/lib/posthogClient";

// export interface ProductColor {
//   name: string; // Nombre técnico del color (ej: "black", "white")
//   hex: string; // Código hexadecimal del color (ej: "#000000")
//   label: string; // Nombre mostrado al usuario (ej: "Negro Medianoche")
//   sku: string; // SKU específico para esta variante de color
//   price?: string; // Precio específico para este color (opcional)
//   originalPrice?: string; // Precio original antes de descuento (opcional)
//   discount?: string; // Descuento específico para este color (opcional)
// }

// export interface ExploreProductProps {
//   id: string;
//   name: string;
//   image: string | StaticImageData;
//   onAddToCart?: (productId: string, color: string) => void;
//   sku?: string | null;
// }

// export default function ExploreProduct({
//   id,
//   name,
//   image,
// }: ExploreProductProps) {
//   const router = useRouter();
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Integración con el contexto del carrito
//   const { addProduct } = useCartContext();

//   const handleMoreInfo = () => {
//     console.log(`🔗 Navegando a producto con ID: ${id}`);
//     console.log(`📝 Nombre del producto: ${name}`);
//     // Navega usando el id del mock, no el nombre ni slug
//     router.push(`/productos/view/${id}`);
//     posthogUtils.capture("product_more_info_click", {
//       product_id: id,
//       product_name: name,
//       source: "product_card",
//     });
//   };

//   return (
//     <div
//       className={cn(
//         "bg-[#D9D9D9] rounded-2xl shadow-sm border border-gray-300 overflow-hidden transition-all duration-300",
//         "hover:shadow-lg hover:-translate-y-1",
//         className
//       )}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Header con badges */}
//       <div className="relative">
//         {/* Imagen del producto */}
//         <div className="relative bg-white aspect-square overflow-hidden">
//           <Image
//             src={image}
//             alt={name}
//             fill
//             className={cn(
//               "object-contain transition-transform duration-300 p-6",
//               isHovered && "scale-105"
//             )}
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//         </div>
//       </div>

//       {/* Contenido */}
//       <div className="p-4 bg-[#D9D9D9]">
//         {/* Título del producto */}
//         <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 leading-5 truncate">
//           {name}
//         </h3>

//         {/* Botones de acción */}
//         <div className="space-y-2">
//           <button
//             //onClick={handleAddToCart}
//             disabled={isLoading}
//             className={cn(
//               "w-full bg-blue-900 text-white py-3 px-4 rounded-lg text-sm font-semibold",
//               "transition-all duration-200 flex items-center justify-center gap-2",
//               "hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed",
//               isLoading && "animate-pulse"
//             )}
//           >
//             {isLoading ? "Añadiendo..." : "Añadir al carrito"}
//           </button>

//           <button
//             onClick={handleMoreInfo}
//             className="w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors duration-200"
//           >
//             Conoce mas
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
