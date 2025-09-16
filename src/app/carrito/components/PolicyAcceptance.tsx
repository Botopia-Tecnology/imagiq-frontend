"use client";

interface PolicyAcceptanceProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function PolicyAcceptance({
  checked,
  onChange,
}: PolicyAcceptanceProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-blue-600 w-4 h-4"
        required
      />
      <span className="text-sm">
        He leído y acepto las políticas de privacidad
      </span>
    </div>
  );
}
