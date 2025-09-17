"use client";
import { useRouter } from "next/navigation";

interface CheckoutActionsProps {
  onBack?: () => void;
  onFinish: () => void;
  isProcessing: boolean;
  isAccepted: boolean;
  error?: string;
}

export default function CheckoutActions({
  onBack,
  onFinish,
  isProcessing,
  isAccepted,
  error,
}: CheckoutActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      {/* Back Button */}
      {typeof onBack === "function" && (
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 text-[#2563EB] font-semibold text-base py-2 rounded-lg bg-white border border-[#e5e5e5] shadow-sm hover:bg-[#e6f3ff] hover:text-[#005bb5] focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all duration-150"
          onClick={onBack}
        >
          <span className="text-lg">←</span>
          <span>Volver</span>
        </button>
      )}

      {/* Finish Payment Button */}
      <button
        type="button"
        className={`w-full bg-[#2563EB] text-white font-bold py-3 rounded-lg text-base hover:bg-blue-700 transition flex items-center justify-center ${
          isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={!isAccepted || isProcessing}
        data-testid="checkout-finish-btn"
        aria-busy={isProcessing}
        onClick={onFinish}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2" aria-live="polite">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-green-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Procesando tu compra…</span>
          </span>
        ) : (
          "Finalizar pago"
        )}
      </button>

      {/* Back to Store Button */}
      <button
        type="button"
        className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-600 transition"
        onClick={() => router.push("/")}
        data-testid="checkout-back-to-home"
      >
        Regresar al comercio
      </button>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm text-center w-full">{error}</div>
      )}
    </div>
  );
}
