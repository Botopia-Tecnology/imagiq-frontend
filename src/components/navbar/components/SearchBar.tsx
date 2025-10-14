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
    className="relative flex items-center rounded-full px-4 h-10 transition-all duration-300 w-[220px] backdrop-blur-md border-white/30 bg-gray-100"
    style={{ overflow: "hidden" }}
  >
    <Search className="w-5 h-5 mr-2 text-gray-600" />
    <input
      type="text"
      className="w-full bg-transparent border-none focus:outline-none text-[12.5px] text-gray-900 placeholder-gray-500"
      placeholder="Búsqueda"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Buscar productos"
      autoComplete="off"
    />
  </form>
);
