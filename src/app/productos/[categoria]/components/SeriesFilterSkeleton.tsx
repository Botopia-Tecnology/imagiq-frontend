/**
 * SERIES FILTER SKELETON - Loading state para SeriesFilter
 */

export default function SeriesFilterSkeleton() {
  return (
    <section>
      <div className="animate-pulse">
        {/* Título skeleton */}
        <div className="h-8 sm:h-10 md:h-12 lg:h-14 w-3/4 max-w-2xl bg-gray-200 rounded-lg py-4 sm:mb-6 md:mb-8 lg:mb-10" />

        {/* Slider skeleton */}
        <div className="flex gap-3 sm:gap-4 overflow-hidden pb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 bg-gray-200 rounded-xl h-28 sm:h-32 lg:h-36 min-w-[220px] max-w-[450px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
