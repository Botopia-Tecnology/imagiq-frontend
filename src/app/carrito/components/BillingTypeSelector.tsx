"use client";

interface BillingTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function BillingTypeSelector({
  value,
  onChange,
  error,
}: BillingTypeSelectorProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Datos de facturación</h2>
      <select
        className={`w-full bg-white rounded-xl px-4 py-2 text-sm border border-[#E5E5E5] focus:border-[#2563EB] hover:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] mb-2 transition-all duration-150 font-medium text-gray-700 ${
          error ? "border-red-500" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Selecciona un tipo de facturación</option>
        <option value="personal">Personal</option>
        <option value="empresa">Empresa</option>
      </select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
