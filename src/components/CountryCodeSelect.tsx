// CountryCodeSelect.tsx
// Selector de indicativos internacionales con búsqueda y personalización visual
// Uso: <CountryCodeSelect value={value} onChange={onChange} disabled={disabled} />
import React, { useState } from "react";

const countryCodes = [
  { code: "+57", label: "Colombia", flag: "🇨🇴" },
  { code: "+1", label: "Estados Unidos", flag: "🇺🇸" },
  { code: "+34", label: "España", flag: "🇪🇸" },
  { code: "+52", label: "México", flag: "🇲🇽" },
  { code: "+54", label: "Argentina", flag: "🇦🇷" },
  { code: "+55", label: "Brasil", flag: "🇧🇷" },
  { code: "+51", label: "Perú", flag: "🇵🇪" },
  { code: "+56", label: "Chile", flag: "🇨🇱" },
  { code: "+593", label: "Ecuador", flag: "🇪🇨" },
  { code: "+58", label: "Venezuela", flag: "🇻🇪" },
  { code: "+591", label: "Bolivia", flag: "🇧🇴" },
  { code: "+502", label: "Guatemala", flag: "🇬🇹" },
  { code: "+503", label: "El Salvador", flag: "🇸🇻" },
  { code: "+504", label: "Honduras", flag: "🇭🇳" },
  { code: "+505", label: "Nicaragua", flag: "🇳🇮" },
  { code: "+506", label: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", label: "Panamá", flag: "🇵🇦" },
  { code: "+592", label: "Guyana", flag: "🇬🇾" },
  { code: "+53", label: "Cuba", flag: "🇨🇺" },
  { code: "+598", label: "Uruguay", flag: "🇺🇾" },
  { code: "+44", label: "Reino Unido", flag: "🇬🇧" },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = countryCodes.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );
  const selected =
    countryCodes.find((c) => c.code === value) || countryCodes[0];

  return (
    <div className="relative w-full max-w-[140px]" style={{ minWidth: 120 }}>
      <button
        type="button"
        className={`input-samsung w-full flex items-center gap-2 pl-2 pr-6 py-2 text-sm font-medium border border-[#d1d5db] rounded-l-xl focus:border-[#0074e8] focus:ring-2 focus:ring-[#0074e8] transition-all duration-150 appearance-none cursor-pointer text-gray-700 bg-white ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        style={{ height: 48 }}
        onClick={() => !disabled && setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        tabIndex={0}
      >
        <span>{selected.flag}</span>
        <span className="font-semibold">{selected.code}</span>
        <span className="ml-auto text-[#0074e8] text-base">▼</span>
      </button>
      {open && (
        <div className="absolute z-20 left-0 top-full mt-1 w-full min-w-[140px] bg-white border border-[#0074e8] rounded-xl shadow-2xl animate-fadein">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-[#e5e5e5] focus:outline-none text-sm"
            placeholder="Buscar país o código..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            style={{ borderRadius: "0.75rem 0.75rem 0 0" }}
          />
          <div className="max-h-48 overflow-auto">
            <select
              className="w-full px-3 py-2 text-sm border-none bg-transparent appearance-none focus:outline-none"
              size={Math.min(6, Math.max(3, filtered.length))}
              value={filtered.some(f => f.code === value) ? value : ""}
              onChange={(e) => {
                const selectedCode = e.target.value;
                onChange(selectedCode);
                setOpen(false);
                setSearch("");
              }}
              aria-label="Seleccionar código de país"
            >
              {filtered.length === 0 ? (
                <option disabled value="">
                  No encontrado
                </option>
              ) : (
                filtered.map((c) => (
                  <option key={c.code} value={c.code}>
                    {`${c.flag} ${c.label} ${c.code}`}
                  </option>
                ))
              )}
            </select>
          </div>
          <style jsx>{`
            .animate-fadein {
              animation: fadein 0.18s ease;
            }
            @keyframes fadein {
              from {
                opacity: 0;
                transform: translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelect;
