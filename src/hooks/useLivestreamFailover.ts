'use client';

import { useState, useCallback, useRef } from 'react';
import type { LivestreamConfig } from '@/services/multimedia-pages.service';
import type { StreamPhase } from './useLivestreamState';

// YouTube error codes that indicate a fatal player issue
const FATAL_ERROR_CODES = new Set([2, 5, 100, 101, 150]);

interface StreamState {
  switchToBackup: () => void;
  isUsingBackup: boolean;
  setPhase: (phase: StreamPhase) => void;
}

interface UseLivestreamFailoverReturn {
  handlePlayerError: (errorCode: number) => void;
  handlePlayerStateChange: (state: number) => void;
  isFailingOver: boolean;
}

export function useLivestreamFailover(
  config: LivestreamConfig,
  streamState: StreamState,
): UseLivestreamFailoverReturn {
  const [isFailingOver, setIsFailingOver] = useState(false);
  const failoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePlayerError = useCallback(
    (errorCode: number) => {
      if (!FATAL_ERROR_CODES.has(errorCode)) return;

      // Can we failover?
      if (config.failover_enabled && config.backup_video_id && !streamState.isUsingBackup) {
        setIsFailingOver(true);

        // Brief overlay then switch
        failoverTimerRef.current = setTimeout(() => {
          streamState.switchToBackup();
          setIsFailingOver(false);
        }, 1500);
      } else {
        // No backup available or already using it
        streamState.setPhase('error');
      }
    },
    [config.failover_enabled, config.backup_video_id, streamState],
  );

  const handlePlayerStateChange = useCallback(
    (state: number) => {
      // YT.PlayerState.PLAYING = 1
      if (state === 1 && isFailingOver) {
        setIsFailingOver(false);
        if (failoverTimerRef.current) {
          clearTimeout(failoverTimerRef.current);
          failoverTimerRef.current = null;
        }
      }
      // YT.PlayerState.ENDED = 0
      if (state === 0) {
        streamState.setPhase('post-stream');
      }
    },
    [isFailingOver, streamState],
  );

  return {
    handlePlayerError,
    handlePlayerStateChange,
    isFailingOver,
  };
}
