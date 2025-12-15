/**
 * Skeleton loader para StoresCarousel
 */

export default function StoresCarouselSkeleton() {
  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse" />
        </div>

        {/* Filters skeleton */}
        <div className="flex gap-4 mb-6 justify-center">
          <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
        </div>

        {/* Carousel skeleton */}
        <div className="relative">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                {/* Image skeleton */}
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4" />

                {/* Title skeleton */}
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />

                {/* Address skeleton */}
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />

                {/* Info skeleton */}
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>

                {/* Button skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg w-full mt-4" />
              </div>
            ))}
          </div>

          {/* Navigation buttons skeleton */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
