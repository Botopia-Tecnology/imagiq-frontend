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

function PreStreamPlaceholder({ enableChat }: { enableChat: boolean }) {
  return (
    <div className="w-full bg-gray-50 border-t border-gray-100">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" style={{ maxWidth: '1440px' }}>
        <div className={enableChat ? 'grid grid-cols-1 md:grid-cols-[1fr_350px] gap-6' : ''}>
          {/* Info area */}
          <div className="flex flex-col items-center justify-center text-center py-6 md:py-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p className="text-sm md:text-base font-medium text-gray-500">
              La transmision comenzara pronto
            </p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">
              El video aparecera aqui automaticamente
            </p>
          </div>

          {/* Chat placeholder */}
          {enableChat && (
            <div className="hidden md:flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white min-h-[300px]">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <svg className="w-4.5 h-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 20.25v-1.5a2.25 2.25 0 012.25-2.25h12a2.25 2.25 0 012.25 2.25v1.5M3.75 20.25h16.5M3.75 7.5h16.5v9a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-9z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Chat en vivo</p>
              <p className="text-xs text-gray-300 mt-0.5">Disponible durante la transmision</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveStreamSection({ config }: LiveStreamSectionProps) {
  const streamState = useLivestreamState(config);
  const failover = useLivestreamFailover(config, streamState);
  const pip = usePictureInPicture({ enabled: config.enable_pip && streamState.phase === 'live' });

  const { phase, activeVideoId, timeUntilStart } = streamState;
  const { isFailingOver, handlePlayerError, handlePlayerStateChange } = failover;

  const showChat = config.enable_chat && phase === 'live';
  const chatRight = config.chat_position === 'right';

  // Pre-stream: countdown facade (no iframe) + placeholder
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
        <PreStreamPlaceholder enableChat={config.enable_chat} />
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
