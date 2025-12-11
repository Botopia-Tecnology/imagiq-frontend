import { Search } from "lucide-react";
import type { FC, FormEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
};

export const SearchBar: FC<Props> = ({ value, onChange, onSubmit }) => (
  <form
    onSubmit={onSubmit}
    className="relative flex items-center rounded-full px-5 h-12 lg:px-4 lg:h-10 transition-all duration-300 w-[240px] lg:w-[200px] xl:w-[220px] 2xl:w-[260px] backdrop-blur-md border border-gray-200 bg-white shadow-md"
    style={{
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)"
    }}
  >
    <Search className="w-5 h-5 lg:w-4 lg:h-4 mr-3 lg:mr-2.5 text-gray-500" />
    <input
      type="text"
      className="w-full bg-transparent border-none focus:outline-none text-[15px] lg:text-[14px] text-gray-900 placeholder-gray-400 font-medium"
      placeholder="Búsqueda"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Buscar productos"
      autoComplete="off"
    />
  </form>
);
