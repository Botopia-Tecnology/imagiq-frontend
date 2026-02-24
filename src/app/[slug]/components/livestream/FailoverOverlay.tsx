'use client';

interface FailoverOverlayProps {
  message: string;
  isVisible: boolean;
}

export default function FailoverOverlay({ message, isVisible }: FailoverOverlayProps) {
  return (
    <div
      className={`absolute inset-0 z-20 bg-black/80 flex flex-col items-center justify-center text-white transition-opacity duration-500 rounded-lg ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Spinner */}
      <svg
        className="animate-spin h-8 w-8 text-white mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>

      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
