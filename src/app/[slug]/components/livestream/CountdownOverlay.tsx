'use client';

interface CountdownOverlayProps {
  timeUntilStart: number;
  title?: string;
  subtitle?: string;
  thumbnailUrl?: string;
  videoId: string;
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (days > 0) {
    return { days: String(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
  }
  return { days: null, hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

export default function CountdownOverlay({
  timeUntilStart,
  title,
  subtitle,
  thumbnailUrl,
  videoId,
}: CountdownOverlayProps) {
  const countdown = formatCountdown(timeUntilStart);
  const bgImage = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      {/* Thumbnail background */}
      <img
        src={bgImage}
        alt={title || 'Stream thumbnail'}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
        {/* Title */}
        {title && (
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 text-center px-4">
            {title}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm md:text-lg text-white/80 mb-6 text-center px-4">
            {subtitle}
          </p>
        )}

        {/* Countdown digits */}
        <div className="flex items-center gap-2 md:gap-4">
          {countdown.days && (
            <>
              <CountdownUnit value={countdown.days} label="DIAS" />
              <span className="text-2xl md:text-4xl font-light text-white/50">:</span>
            </>
          )}
          <CountdownUnit value={countdown.hours} label="HORAS" />
          <span className="text-2xl md:text-4xl font-light text-white/50">:</span>
          <CountdownUnit value={countdown.minutes} label="MIN" />
          <span className="text-2xl md:text-4xl font-light text-white/50">:</span>
          <CountdownUnit value={countdown.seconds} label="SEG" />
        </div>

        {/* Pulsing indicator */}
        <div className="mt-6 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
            Muy pronto
          </span>
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
        {value}
      </span>
      <span className="text-[10px] md:text-xs font-medium text-white/60 uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}
