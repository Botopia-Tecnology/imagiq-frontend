interface InstructionsBoxProps {
  title: string;
  instructions: string;
}

export function InstructionsBox({ title, instructions }: Readonly<InstructionsBoxProps>) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 w-full max-w-md">
      <div className="flex items-start">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">{title}</h3>
          <p className="text-blue-800 text-sm">{instructions}</p>
        </div>
      </div>
    </div>
  );
}
