'use client';

import YouTube, { YouTubeEvent } from 'react-youtube';

interface LiveStreamPlayerProps {
  videoId: string;
  autoplay: boolean;
  onError: (errorCode: number) => void;
  onStateChange: (state: number) => void;
  onReady?: () => void;
}

export default function LiveStreamPlayer({
  videoId,
  autoplay,
  onError,
  onStateChange,
  onReady,
}: LiveStreamPlayerProps) {
  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: autoplay ? 1 : 0,
      mute: autoplay ? 1 : 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
  };

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        className="absolute inset-0 w-full h-full"
        iframeClassName="w-full h-full"
        onError={(e: YouTubeEvent<number>) => onError(e.data)}
        onStateChange={(e: YouTubeEvent<number>) => onStateChange(e.data)}
        onReady={() => onReady?.()}
      />
    </div>
  );
}
