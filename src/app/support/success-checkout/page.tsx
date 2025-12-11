"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SupportSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = params?.get("orderId");
  const status = params?.get("status") || "APPROVED";

  useEffect(() => {
    // Optionally, we could auto-navigate back to support start after a timeout
    const t = setTimeout(() => {
      router.push("/soporte/inicio_de_soporte");
    }, 8000);

    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-emerald-700 mb-4">Pago de Soporte Completado</h1>
        <p className="text-sm text-gray-600 mb-6">
          Gracias. Tu pago se procesó correctamente.
        </p>

        {orderId && (
          <p className="text-sm text-gray-700 mb-4">Número de orden: <strong>{orderId}</strong></p>
        )}

        <p className="text-sm text-gray-500 mb-6">Estado: <strong>{status}</strong></p>

        <div className="flex justify-center gap-3">
          <a href="/soporte/inicio_de_soporte" className="px-4 py-2 bg-emerald-600 text-white rounded">Volver a soporte</a>
          <a href="/" className="px-4 py-2 border rounded">Ir al inicio</a>
        </div>

        <p className="mt-6 text-xs text-gray-400">Serás redirigido automáticamente al inicio de soporte en 8 segundos.</p>
      </div>
    </div>
  );
}
