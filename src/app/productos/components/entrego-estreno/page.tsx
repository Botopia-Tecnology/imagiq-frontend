/**
 * Página de Entrego y Estreno
 * Importa el componente desde la ruta correcta
 */
import EntregoEstreno from "./EntregoEstreno";

// Producto de prueba para compilar correctamente
const mockProduct = {
  id: "iphone-11-pro-256",
  name: "iPhone 11 Pro 256GB",
  price: 3054000,
  image: "/img/dispositivosmoviles/iphone11pro.png",
};

export default function EntregoEstrenoPage() {
  return <EntregoEstreno product={mockProduct} />;
}
