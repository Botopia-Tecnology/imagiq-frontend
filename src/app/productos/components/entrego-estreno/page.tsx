/**
 * Página de Entrego y Estreno
 * Importa el componente desde la ruta correcta
 */
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import EntregoEstreno from "./EntregoEstreno";

// Producto de prueba para compilar correctamente
const mockProduct = {
  id: "iphone-11-pro-256",
  name: "iPhone 11 Pro 256GB",
  price: 3054000,
  image: "/img/dispositivosmoviles/iphone11pro.png",
};

export default function EntregoEstrenoPage() {
  const entregoReveal = useScrollReveal<HTMLDivElement>({
    offset: 100,
    duration: 700,
    direction: "up",
  });
  return (
    <motion.div ref={entregoReveal.ref} {...entregoReveal.motionProps}>
      <EntregoEstreno product={mockProduct} />
    </motion.div>
  );
}
