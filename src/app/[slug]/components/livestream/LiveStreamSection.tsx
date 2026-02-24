'use client';

import type { LivestreamConfig } from '@/services/multimedia-pages.service';
import { useLivestreamState } from '@/hooks/useLivestreamState';
import { useLivestreamFailover } from '@/hooks/useLivestreamFailover';
import { usePictureInPicture } from '@/hooks/usePictureInPicture';
import LiveStreamPlayer from './LiveStreamPlayer';
import CountdownOverlay from './CountdownOverlay';
import LiveBadge from './LiveBadge';
import LiveChat from './LiveChat';
import FailoverOverlay from './FailoverOverlay';
import PipPlayerWrapper from './PipPlayerWrapper';

interface LiveStreamSectionProps {
  config: LivestreamConfig;
}

export default function LiveStreamSection({ config }: LiveStreamSectionProps) {
  const streamState = useLivestreamState(config);
  const failover = useLivestreamFailover(config, streamState);
  const pip = usePictureInPicture({ enabled: config.enable_pip && streamState.phase === 'live' });

  const { phase, activeVideoId, timeUntilStart } = streamState;
  const { isFailingOver, handlePlayerError, handlePlayerStateChange } = failover;

  const showChat = config.enable_chat && phase === 'live';
  const chatRight = config.chat_position === 'right';

  // Pre-stream: countdown facade (no iframe)
  if (phase === 'pre-stream' && config.enable_countdown && timeUntilStart !== null) {
    return (
      <section className="w-full">
        <CountdownOverlay
          timeUntilStart={timeUntilStart}
          title={config.countdown_title}
          subtitle={config.countdown_subtitle}
          thumbnailUrl={config.thumbnail_url}
          videoId={config.primary_video_id}
        />
      </section>
    );
  }

  // Error state
  if (phase === 'error') {
    return (
      <section className="w-full">
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-white">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">La transmision no esta disponible</p>
            <p className="text-sm text-white/60">Intentalo de nuevo mas tarde</p>
          </div>
        </div>
      </section>
    );
  }

  // Live or post-stream: show player
  const showReplay = phase === 'post-stream' && config.enable_replay;
  const showPlayer = phase === 'live' || showReplay;

  if (!showPlayer) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Sentinel: marks inline video position for IntersectionObserver */}
      <div ref={pip.sentinelRef} />

      <div
        className={
          showChat && chatRight
            ? 'grid grid-cols-1 md:grid-cols-[1fr_350px] gap-4'
            : 'flex flex-col gap-4'
        }
      >
        {/* Video container with PiP wrapper */}
        <PipPlayerWrapper
          isPip={pip.isPip}
          onDismiss={pip.dismiss}
          onRestore={pip.restore}
        >
          <div className="relative">
            <LiveStreamPlayer
              videoId={activeVideoId}
              autoplay={config.autoplay}
              onError={handlePlayerError}
              onStateChange={handlePlayerStateChange}
            />

            {/* Live badge */}
            {config.enable_live_badge && <LiveBadge isLive={phase === 'live'} />}

            {/* Failover overlay */}
            <FailoverOverlay
              message={config.failover_message || 'Cambiando transmision...'}
              isVisible={isFailingOver}
            />
          </div>
        </PipPlayerWrapper>

        {/* Chat: hidden when PiP is active */}
        {showChat && !pip.isPip && (
          <LiveChat videoId={activeVideoId} isLive={phase === 'live'} />
        )}
      </div>
    </section>
  );
}
