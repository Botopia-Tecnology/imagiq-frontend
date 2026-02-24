'use client';

interface LiveBadgeProps {
  isLive: boolean;
}

export default function LiveBadge({ isLive }: LiveBadgeProps) {
  if (!isLive) return null;

  return (
    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      EN VIVO
    </div>
  );
}
