"use client";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Documento, SupportOrderResponse } from "@/types/support";
import Link from "next/link";
import { useState } from "react";

export default function InicioDeSoportePage() {
  const [cedula, setCedula] = useState("");
  const [orden, setOrden] = useState("");
  const [errors, setErrors] = useState<{ cedula?: string; orden?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [result, setResult] = useState<SupportOrderResponse | null>(null);

  const validate = () => {
    const e: { cedula?: string; orden?: string } = {};
    const cedulaDigits = cedula.replaceAll(/\D/g, "");
    if (!cedulaDigits) e.cedula = "La cédula es requerida.";
    else if (cedulaDigits.length < 7) e.cedula = "Ingresa al menos 7 dígitos.";
    else if (cedulaDigits.length > 12) e.cedula = "Demasiados dígitos.";

    if (!orden.trim()) e.orden = "El número de orden es requerido.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePaySubmit = async (doc: Documento) => {
    const cartItem = {
      id: doc.documento || "0",
      name: "0",
      image: "0",
      price: 0,
      originalPrice: 0,
      stock: 0,
      sku: "0",
      ean: "0",
      puntos_q: 0,
      color: "0",
      colorName: "0",
      capacity: "0",
      ram: "0",
      skuPostback: "0",
      desDetallada: "0",
      quantity: 1,
    };
    console.log("Agregando al carrito:", cartItem);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setLoading(true);

    try {
      // Simular retardo
      await new Promise((r) => setTimeout(r, 900));

      console.log("Enviando solicitud de soporte:", { cedula, orden });

      // Esperar la respuesta real de la API
      const response = await apiClient.post<SupportOrderResponse>(
        "/api/orders/support-order",
        {
          numero_cedula: cedula,
          referencia: orden,
        }
      );

      setResult(response.data);
      setCedula("");
      setOrden("");
      setErrors({});
      setSuccess("Solicitud enviada correctamente.");
    } catch (err) {
      console.error(err);
      setSuccess("Ocurrió un error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/images/fondo_soporte.jpg')" }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl w-full max-w-4xl mx-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Columna izquierda: formulario */}
          <div className="lg:col-span-1 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Inicio de Soporte
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Ingresa tu cédula y el número de orden para crear la solicitud de
              soporte. Responderemos a la mayor brevedad.
            </p>

            {success && (
              <span className="mb-6 w-full text-xs rounded-md bg-emerald-50 border border-emerald-100 p-3 text-emerald-800 block">
                {success}
              </span>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Campo Cédula */}
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium">
                  Número de cédula
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="cedula"
                    value={cedula}
                    onChange={(ev) => setCedula(ev.target.value)}
                    type="tel"
                    inputMode="numeric"
                    placeholder="Ej: 12345678"
                    aria-label="Número de cédula"
                    aria-describedby={
                      errors.cedula ? "cedula-error" : undefined
                    }
                    autoFocus
                    className={`mt-0 block w-full rounded-lg border px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.cedula ? "border-rose-500" : "border-gray-200"
                    } bg-white`}
                  />
                </div>
                {errors.cedula && (
                  <p id="cedula-error" className="mt-1 text-xs text-rose-600">
                    {errors.cedula}
                  </p>
                )}
              </div>

              {/* Campo Orden */}
              <div>
                <label htmlFor="orden" className="block text-sm font-medium">
                  Número de orden
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M21 15V7a2 2 0 00-2-2h-6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 9v6a2 2 0 002 2h6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 7l10 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    id="orden"
                    value={orden}
                    onChange={(ev) => setOrden(ev.target.value)}
                    type="text"
                    placeholder="Ej: 2025-0001"
                    aria-label="Número de orden"
                    aria-describedby={errors.orden ? "orden-error" : undefined}
                    className={`mt-0 block w-full rounded-lg border px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.orden ? "border-rose-500" : "border-gray-200"
                    } bg-white`}
                  />
                </div>
                {errors.orden && (
                  <p id="orden-error" className="mt-1 text-xs text-rose-600">
                    {errors.orden}
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 font-semibold shadow-md transition disabled:opacity-60"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    ) : null}
                    {loading ? "Enviando..." : "Enviar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCedula("");
                      setOrden("");
                      setErrors({});
                      setSuccess("");
                      setResult(null);
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Limpiar
                  </button>
                </div>

                <p className="text-xs text-muted-foreground w-full sm:w-auto text-right hidden sm:block">
                  Los datos se usan solo para procesar tu solicitud.
                </p>
              </div>

              <p className="text-xs text-muted-foreground sm:hidden">
                Los datos se usan solo para procesar tu solicitud.
              </p>
            </form>
          </div>

          {/* Columna central: Recomendaciones y Pago */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Consejos</h3>
              <ul className="list-disc pl-5 text-sm space-y-3 text-muted-foreground">
                <li>Asegúrate de ingresar la cédula sin puntos ni guiones.</li>
                <li>
                  El número de orden lo encuentras en el correo de confirmación.
                </li>
                <li>
                  Si necesitas ayuda urgente, contacta al soporte telefónico.
                </li>
              </ul>
            </div>

            {/* Card de pago: Dentro del grid */}
            {result && (
              <div className="grow flex flex-col">
                <div className=" p-8 rounded-lg border border-blue-200 shadow-md flex flex-col h-full">
                  <p className="text-xs font-semibold text-black uppercase tracking-wide mb-4">
                    Resumen de pago
                  </p>
                  <div className="mb-8 grow">
                    <p className="text-sm text-gray-900 mb-2">Monto a pagar:</p>
                    <p
                      className={cn(
                        "font-bold text-gray-900",
                        result.obtenerDocumentosResult.documentos.every(
                          (r) => r.valor === "0,0000"
                        ) === true
                          ? "text-3xl"
                          : "text-5xl"
                      )}
                    >
                      {(() => {
                        const documentos =
                          result?.obtenerDocumentosResult?.documentos;
                        const doc = documentos?.find(
                          (d) => d?.valor && d.valor !== "0,0000"
                        );
                        const raw = doc?.valor;
                        if (!raw) return "Aún no tenemos esta información";

                        const normalized = raw
                          .replaceAll(".", "")
                          .replaceAll(",", ".");
                        const value = Number(normalized);
                        if (Number.isNaN(value)) return raw;

                        const formatted = value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        });

                        return `$${formatted}`;
                      })()}
                    </p>
                  </div>
                  {result.obtenerDocumentosResult.documentos.every(
                    (r) => r.valor === "0,0000"
                  ) !== true && (
                    <div className="w-full flex flex-col gap-2">
                      <Link
                        href={
                          result.obtenerDocumentosResult.documentos.find(
                            (r) => r.valor !== "0,0000"
                          )?.url || "#"
                        }
                        className="w-full rounded-xl inline-flex items-center justify-center px-4 py-2 bg-white text-gray-900 border border-gray-950 font-bold shadow-md transition transform hover:scale-105"
                      >
                        Descargar factura
                      </Link>

                      <Button
                        onClick={() =>
                          handlePaySubmit(
                            result.obtenerDocumentosResult.documentos.find(
                              (r) => r.valor !== "0,0000"
                            )!
                          )
                        }
                        type="button"
                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-black text-white rounded-lg font-bold shadow-md transition transform hover:scale-105"
                      >
                        Ir a pagar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
