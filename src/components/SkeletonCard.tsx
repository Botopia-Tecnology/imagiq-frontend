// components/SkeletonCard.tsx
export default function SkeletonCard() {
  return (
    <div className="animate-pulse flex flex-col space-y-4 bg-gray-100 rounded-lg p-4">
      <div className="bg-gray-300 h-40 w-full rounded-md"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
