/**
 * @module SearchBar
 * @description Samsung-style search bar for help center
 */

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '¿En qué podemos ayudarte?',
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900"
          strokeWidth={1.5}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors text-base font-bold placeholder:font-normal placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default SearchBar;
