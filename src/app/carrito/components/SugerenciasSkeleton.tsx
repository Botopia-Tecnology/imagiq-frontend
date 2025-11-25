import { Skeleton } from "@/components/ui/skeleton";

export default function SugerenciasSkeleton() {
    return (
        <section className="rounded-2xl p-6 mt-2">
            {/* Title Skeleton */}
            <Skeleton className="h-7 w-64 mb-6" />

            {/* Products Row Skeleton */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    {/* Generate 4 skeleton items to match the typical 4 suggestions */}
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center w-full md:w-1/4 px-2"
                        >
                            {/* Image Container Skeleton */}
                            <div className="relative w-28 h-28 mb-2 flex items-center justify-center">
                                <Skeleton className="w-full h-full rounded-xl" />
                            </div>

                            {/* Text Content Skeleton */}
                            <div className="flex flex-col items-center w-full gap-2 mt-2">
                                {/* Product Name - 2 lines */}
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />

                                {/* Price */}
                                <Skeleton className="h-6 w-24 mt-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
