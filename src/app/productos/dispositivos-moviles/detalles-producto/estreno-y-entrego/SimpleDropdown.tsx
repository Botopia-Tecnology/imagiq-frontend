import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownOption {
  id: string;
  name: string;
}

interface SimpleDropdownProps<T extends DropdownOption> {
  label: string;
  placeholder: string;
  isOpen: boolean;
  isDisabled: boolean;
  options: T[];
  selectedOption: T | null;
  onToggle: () => void;
  onSelectOption: (option: T) => void;
}

export default function SimpleDropdown<T extends DropdownOption>({
  label,
  placeholder,
  isOpen,
  isDisabled,
  options,
  selectedOption,
  onToggle,
  onSelectOption,
}: Readonly<SimpleDropdownProps<T>>) {
  // Determine button classes based on state
  const getButtonClasses = () => {
    if (isDisabled) return "bg-gray-50 cursor-not-allowed border-0";
    if (isOpen) return "border-0 bg-white";
    return "border border-gray-300 bg-white hover:bg-gray-50";
  };

  return (
    <div className="mb-6 max-w-2xl mx-auto">
      <span className="block text-xs font-normal text-gray-400 mb-3">
        {label}
      </span>
      <div
        className="relative"
        style={
          isOpen
            ? {
                borderStyle: "dotted",
                borderWidth: "2px",
                borderColor: "#0099FF",
                borderRadius: "6px",
                padding: "0",
              }
            : {}
        }
      >
        <button
          onClick={onToggle}
          disabled={isDisabled}
          className={`w-full px-4 py-4 text-left rounded-md flex items-center justify-between transition-colors ${getButtonClasses()}`}
        >
          <span
            className={`text-sm ${
              isDisabled ? "text-gray-400" : "text-[#222]"
            }`}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </span>
          {isOpen ? (
            <ChevronUp
              className={`w-4 h-4 ${
                isDisabled ? "text-gray-400" : "text-[#222]"
              }`}
            />
          ) : (
            <ChevronDown
              className={`w-4 h-4 ${
                isDisabled ? "text-gray-400" : "text-[#222]"
              }`}
            />
          )}
        </button>

        <AnimatePresence>
          {isOpen && !isDisabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => onSelectOption(option)}
                  className={`w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors ${
                    index === options.length - 1 ? "" : "border-b border-gray-200"
                  }`}
                >
                  <span className="text-sm font-medium text-[#222]">
                    {option.name}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
