"use client";

interface SaveInfoCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function SaveInfoCheckbox({
  checked,
  onChange,
}: SaveInfoCheckboxProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-blue-600 w-4 h-4"
      />
      <span className="text-sm">
        ¿Quieres guardar esta información para tu próxima compra?
      </span>
    </div>
  );
}
