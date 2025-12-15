/**
 * Skeleton loader para ProductShowcase
 */

export default function ProductShowcaseSkeleton() {
  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
            >
              {/* Image skeleton */}
              <div className="aspect-square bg-gray-200 rounded-lg mb-4" />

              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />

              {/* Price skeleton */}
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3" />

              {/* Colors skeleton */}
              <div className="flex gap-2 mb-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="w-8 h-8 bg-gray-200 rounded-full" />
                ))}
              </div>

              {/* Button skeleton */}
              <div className="h-10 bg-gray-200 rounded-lg w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
