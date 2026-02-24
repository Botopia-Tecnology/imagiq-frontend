'use client';

export default function LiveStreamSkeleton() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '1440px' }}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-4">
        {/* Video skeleton */}
        <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse" />
        {/* Chat skeleton */}
        <div className="hidden md:block w-full h-full min-h-[400px] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
