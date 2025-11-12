"use client";

import { useState } from "react";

export default function InicioDeSoportePage() {
  const [cedula, setCedula] = useState("");
  const [orden, setOrden] = useState("");
  const [errors, setErrors] = useState<{ cedula?: string; orden?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    // Simular envío async; reemplazar por fetch/axios a la API real.
    try {
      await new Promise((r) => setTimeout(r, 900));
      console.log("Enviando solicitud de soporte:", { cedula, orden });
      setSuccess("Solicitud enviada correctamente. Te contactaremos pronto.");
      setCedula("");
      setOrden("");
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: "url('/images/fondo_soporte.jpg')" }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl w-full max-w-3xl mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="md:pr-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Inicio de Soporte
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              Ingresa tu cédula y el número de orden para crear la solicitud de
              soporte. Responderemos a la mayor brevedad.
            </p>

            {success && (
              <output className="mb-4 rounded-md bg-emerald-50 border border-emerald-100 p-3 text-emerald-800">
                {success}
              </output>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="cedula" className="block text-sm font-medium">
                  Número de cédula
                </label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {/* icono simple */}
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

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-neutral-800 font-semibold shadow-sm transition disabled:opacity-60"
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
                    }}
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Limpiar
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Los datos se usan solo para procesar tu solicitud.
                </p>
              </div>
            </form>
          </div>

          <div className="hidden md:block border-l pl-6">
            <h3 className="text-lg font-semibold mb-2">Consejos</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
              <li>Asegúrate de ingresar la cédula sin puntos ni guiones.</li>
              <li>
                El número de orden lo encuentras en el correo de confirmación.
              </li>
              <li>
                Si necesitas ayuda urgente, contacta al soporte telefónico.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
