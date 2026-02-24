'use client';

interface CountdownOverlayProps {
  timeUntilStart: number;
  title?: string;
  subtitle?: string;
  thumbnailUrl?: string;
  videoId: string;
  ctaText?: string;
  ctaUrl?: string;
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
  ctaText,
  ctaUrl,
}: CountdownOverlayProps) {
  const countdown = formatCountdown(timeUntilStart);
  const bgImage = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full min-h-[260px] sm:min-h-0 sm:aspect-video bg-black overflow-hidden">
      {/* Thumbnail background */}
      <img
        src={bgImage}
        alt={title || 'Stream thumbnail'}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white px-4 py-6 sm:py-0">
        {/* Title */}
        {title && (
          <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 text-center leading-tight">
            {title}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-sm md:text-lg text-white/80 mb-4 sm:mb-6 text-center">
            {subtitle}
          </p>
        )}

        {/* Countdown digits */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
          {countdown.days && (
            <>
              <CountdownUnit value={countdown.days} label="DIAS" />
              <span className="text-xl sm:text-2xl md:text-4xl font-light text-white/50">:</span>
            </>
          )}
          <CountdownUnit value={countdown.hours} label="HORAS" />
          <span className="text-xl sm:text-2xl md:text-4xl font-light text-white/50">:</span>
          <CountdownUnit value={countdown.minutes} label="MIN" />
          <span className="text-xl sm:text-2xl md:text-4xl font-light text-white/50">:</span>
          <CountdownUnit value={countdown.seconds} label="SEG" />
        </div>

        {/* CTA button */}
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            className="inline-block mt-4 sm:mt-6 px-6 py-2.5 sm:py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            {ctaText}
          </a>
        )}

        {/* Pulsing indicator */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500" />
          </span>
          <span className="text-xs sm:text-sm font-medium text-white/80 uppercase tracking-wider">
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
      <span className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tabular-nums">
        {value}
      </span>
      <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-white/60 uppercase tracking-wider mt-0.5 sm:mt-1">
        {label}
      </span>
    </div>
  );
}
