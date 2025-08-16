"use client";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import ProductCard from "./ProductCard";

// Tipos para productos y sugerencias
type Producto = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
};

type Sugerencia = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
};

// Datos quemados para productos y sugerencias
const productos: Producto[] = [
  {
    id: 1,
    nombre: "Samsung Galaxy S25 Ultra 5G 256GB, Azul",
    precio: 6719900,
    cantidad: 1,
    imagen: "/img/DispositivosMoviles/galaxy_s25.png",
  },
  {
    id: 2,
    nombre: "Samsung Galaxy S25 Ultra 5G 256GB, Azul",
    precio: 6719900,
    cantidad: 1,
    imagen: "/img/DispositivosMoviles/galaxy_s25.png",
  },
];

const sugerencias: Sugerencia[] = [
  {
    id: 3,
    nombre: "Samsung Galaxy Watch7",
    precio: 1099900,
    imagen: "/img/DispositivosMoviles/galaxy_watch7.png",
  },
  {
    id: 4,
    nombre: "Galaxy Buds3 Pro",
    precio: 629900,
    imagen: "/img/DispositivosMoviles/galaxy_buds3pro.png",
  },
  {
    id: 5,
    nombre: "Cargador Adaptador de carga rápida - Cable tipo-C (15W)",
    precio: 74900,
    imagen: "/img/DispositivosMoviles/cargador.png",
  },
];

// Pasos del checkout
const steps = ["Carrito", "Login/Invitado", "Entrega", "Pago", "Éxito"];

interface CarritoStepProps {
  productos: Producto[];
  sugerencias: Sugerencia[];
  onNext: () => void;
}
function CarritoStep({ productos, sugerencias, onNext }: CarritoStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Carrito de compras
      </h2>
      <div className="flex flex-col gap-4">
        {productos.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
        Agrega a tu compra
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sugerencias.map((s) => (
          <div
            key={s.id}
            className="flex flex-col items-center bg-gray-50 rounded-lg p-4 shadow"
          >
            <Image
              src={s.imagen}
              alt={s.nombre}
              width={60}
              height={60}
              className="mb-2"
            />
            <div className="text-sm font-medium text-gray-700 text-center mb-1">
              {s.nombre}
            </div>
            <div className="text-blue-600 font-bold text-base mb-2">
              $ {s.precio.toLocaleString()}
            </div>
            <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-blue-600 transition">
              +
            </button>
          </div>
        ))}
      </div>
      <ResumenCompra productos={productos} onNext={onNext} finalBtn={false} />
    </div>
  );
}

interface LoginStepProps {
  onNext: () => void;
}
function LoginStep({ onNext }: LoginStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Continúa con Log-in
        </h2>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600 transition">
          Iniciar sesión
        </button>
        <span className="text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a href="#" className="text-blue-500 underline">
            Regístrate aquí
          </a>
        </span>
      </div>
      <div className="border-t pt-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Continúa como invitado
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Nombre"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Apellido"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="No. de Cédula"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Celular"
            className="border rounded-lg px-4 py-2"
          />
        </div>
      </div>
      <ResumenCompra productos={productos} onNext={onNext} finalBtn={false} />
    </div>
  );
}

interface EntregaStepProps {
  onNext: () => void;
}
function EntregaStep({ onNext }: EntregaStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Revisa la forma de entrega
      </h2>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="entrega"
            defaultChecked
            className="accent-blue-500"
          />
          <span className="font-medium text-gray-700">Enviar a domicilio</span>
        </label>
        <div className="bg-gray-100 rounded-lg p-3 text-gray-700 font-semibold">
          Calle 50A #52-71 Barrio Galerías
        </div>
        <a href="#" className="text-blue-500 underline text-sm">
          Modificar domicilio o elegir otro
        </a>
        <label className="flex items-center gap-2 mt-2">
          <input type="radio" name="entrega" className="accent-blue-500" />
          <span className="font-medium text-gray-700">Recoger en tienda</span>
        </label>
        <a href="#" className="text-blue-500 underline text-sm">
          Mira en el mapa la tienda más cercana
        </a>
      </div>
      <ResumenCompra productos={productos} onNext={onNext} finalBtn={false} />
    </div>
  );
}

interface PagoStepProps {
  onNext: () => void;
}
function PagoStep({ onNext }: PagoStepProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Método de pago</h2>
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="pago"
            defaultChecked
            className="accent-blue-500"
          />
          <span className="font-medium text-gray-700">
            Tarjeta de crédito/débito
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
          <input
            type="text"
            placeholder="Número de tarjeta"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Fecha de vencimiento (MM/AA)"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Código de seguridad"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Nombre del titular"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Tipo documento"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Número de documento"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Cuotas"
            className="border rounded-lg px-4 py-2"
          />
        </div>
        <label className="flex items-center gap-2">
          <input type="radio" name="pago" className="accent-blue-500" />
          <span className="font-medium text-gray-700">
            PSE y billetera Mercado Pago
          </span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="pago" className="accent-blue-500" />
          <span className="font-medium text-gray-700">Addi - Paga después</span>
        </label>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Datos de facturación
        </h3>
        <select className="border rounded-lg px-4 py-2 w-full mb-2">
          <option>Selecciona un tipo de facturación</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-blue-500" /> He leído y
          acepto las políticas de privacidad
        </label>
      </div>
      <ResumenCompra productos={productos} onNext={onNext} finalBtn={true} />
    </div>
  );
}

function ExitoStep() {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl shadow-lg p-8 w-full max-w-xl mx-auto">
      <FaCheckCircle size={120} color="#2ecc40" className="mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ¡Gracias por tu compra!
      </h1>
      <p className="text-lg text-gray-700">
        Tu pedido ha sido procesado exitosamente.
      </p>
    </div>
  );
}

interface ResumenCompraProps {
  productos: Producto[];
  onNext: () => void;
  finalBtn: boolean;
}
function ResumenCompra({ productos, onNext, finalBtn }: ResumenCompraProps) {
  const totalProductos = productos.length;
  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const descuento = 1000000;
  const envio = 20000;
  const total = subtotal - descuento + envio;
  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-8 flex flex-col gap-2 shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Resumen de compra
      </h3>
      <div className="flex justify-between text-gray-700 font-medium">
        <span>Productos ({totalProductos})</span>
        <span>$ {subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Descuento</span>
        <span className="text-red-500">- $ {descuento.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-700">
        <span>Envío</span>
        <span>$ {envio.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-gray-900 font-bold text-lg mt-2">
        <span>Total</span>
        <span>$ {total.toLocaleString()}</span>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        Incluye $ 1.200.000 de impuestos
      </div>
      <button
        className={`w-full py-3 rounded-lg font-bold text-white transition ${
          finalBtn
            ? "bg-green-500 hover:bg-green-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={onNext}
      >
        {finalBtn ? "Finalizar pago" : "Continuar pago"}
      </button>
    </div>
  );
}

/**
 * Componente principal del flujo de carrito y checkout
 */
const Details = () => {
  const [step, setStep] = useState(0);
  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));

  return (
    <div className="min-h-screen bg-white py-12 px-4 flex flex-col items-center">
      {/* Header de pasos */}
      <div className="w-full max-w-5xl mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
        <div className="flex justify-between items-center mb-2">
          {steps.map((label, idx) => (
            <span
              key={label}
              className={`flex-1 text-center py-2 rounded-lg font-semibold text-sm transition ${
                idx === step
                  ? "bg-blue-500 text-white shadow"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Renderiza el paso actual */}
      <div className="w-full max-w-5xl">
        {step === 0 && (
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="bg-gray-100 rounded-xl p-8 flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Producto</h2>
              <div className="flex flex-col gap-4">
                {productos.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                Agrega a tu compra
              </h3>
              <div className="flex gap-4">
                {sugerencias.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col items-center bg-white rounded-lg p-4 shadow w-1/3"
                  >
                    <Image
                      src={s.imagen}
                      alt={s.nombre}
                      width={60}
                      height={60}
                      className="mb-2"
                    />
                    <div className="text-sm font-medium text-gray-700 text-center mb-1">
                      {s.nombre}
                    </div>
                    <div className="text-gray-900 font-bold text-base mb-2">
                      $ {s.precio.toLocaleString()}
                    </div>
                    <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-blue-600 transition">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <ResumenCompra
              productos={productos}
              onNext={handleNext}
              finalBtn={false}
            />
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="bg-gray-100 rounded-xl p-8 flex-1 flex flex-col gap-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Continua con Log-in
                </h2>
                <p className="text-gray-700 mb-4">
                  Inicia sesión para tener envío gratis, acumular puntos y más
                  beneficios
                </p>
                <button className="bg-gray-900 text-white py-2 px-6 rounded-lg font-semibold hover:bg-gray-800 transition w-full mb-2">
                  Iniciar sesión
                </button>
                <span className="text-sm text-gray-600">
                  ¿No tienes cuenta?{" "}
                  <a href="#" className="text-blue-500 underline">
                    Regístrate aquí
                  </a>
                </span>
              </div>
              <div className="border-t pt-6 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Continúa como invitado
                </h3>
                <p className="text-gray-700 mb-4">
                  ¿Estás usando el proceso de compra como invitado? Podrías
                  estar perdiendo Puntos beneficios exclusivos
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="No. de Cédula"
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Celular"
                    className="border rounded-lg px-4 py-2 col-span-2"
                  />
                </div>
              </div>
            </div>
            <ResumenCompra
              productos={productos}
              onNext={handleNext}
              finalBtn={false}
            />
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="bg-gray-100 rounded-xl p-8 flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Revisa la forma de entrega
              </h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="entrega"
                    defaultChecked
                    className="accent-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    Enviar a domicilio
                  </span>
                </label>
                <div className="bg-white rounded-lg p-3 text-gray-700 font-semibold flex items-center justify-between">
                  Calle 50A #52-71 Barrio Galerías
                </div>
                <a href="#" className="text-blue-500 underline text-sm">
                  Modificar domicilio o elegir otro
                </a>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="radio"
                    name="entrega"
                    className="accent-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    Recoger en tienda
                  </span>
                </label>
                <div className="bg-white rounded-lg p-3 text-gray-700 font-semibold flex items-center justify-between">
                  Mira en el mapa la tienda más cercana
                </div>
                <a href="#" className="text-blue-500 underline text-sm">
                  Mira en el mapa la tienda más cercana
                </a>
              </div>
            </div>
            <ResumenCompra
              productos={productos}
              onNext={handleNext}
              finalBtn={false}
            />
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="bg-gray-100 rounded-xl p-8 flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Método de pago
              </h2>
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="pago"
                    defaultChecked
                    className="accent-blue-500"
                  />
                  <span className="font-medium text-gray-700">
                    Tarjeta de crédito/débito
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-4 bg-white rounded-lg p-4">
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    className="border rounded-lg px-4 py-2 col-span-3"
                  />
                  <input
                    type="text"
                    placeholder="Fecha de vencimiento (MM/AA)"
                    className="border rounded-lg px-4 py-2 col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Código de seguridad"
                    className="border rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Nombre del titular"
                    className="border rounded-lg px-4 py-2 col-span-3"
                  />
                  <input
                    type="text"
                    placeholder="Tipo documento"
                    className="border rounded-lg px-4 py-2 col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Número de documento"
                    className="border rounded-lg px-4 py-2 col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Cuotas"
                    className="border rounded-lg px-4 py-2 col-span-3"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input type="radio" name="pago" className="accent-blue-500" />
                  <span className="font-medium text-gray-700">
                    PSE y billetera Mercado Pago
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="pago" className="accent-blue-500" />
                  <span className="font-medium text-gray-700">
                    Addi - Paga después
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm mt-2">
                  <input type="checkbox" className="accent-blue-500" /> ¿Quieres
                  guardar esta información para tu próxima compra?
                </label>
              </div>
              <div className="bg-white rounded-lg p-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Datos de facturación
                </h3>
                <select className="border rounded-lg px-4 py-2 w-full mb-2">
                  <option>Selecciona un tipo de facturación</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-blue-500" /> He leído
                  y acepto las políticas de privacidad
                </label>
              </div>
            </div>
            <ResumenCompra
              productos={productos}
              onNext={handleNext}
              finalBtn={true}
            />
          </div>
        )}
        {step === 4 && <ExitoStep />}
      </div>
    </div>
  );
};

export default Details;
