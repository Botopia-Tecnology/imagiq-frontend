'use client';

import { useState, useEffect, useCallback } from 'react';
import type { LivestreamConfig } from '@/services/multimedia-pages.service';

export type StreamPhase = 'pre-stream' | 'live' | 'post-stream' | 'error';

interface UseLivestreamStateReturn {
  phase: StreamPhase;
  activeVideoId: string;
  isUsingBackup: boolean;
  timeUntilStart: number | null;
  switchToBackup: () => void;
  setPhase: (phase: StreamPhase) => void;
}

export function useLivestreamState(config: LivestreamConfig): UseLivestreamStateReturn {
  const [phase, setPhase] = useState<StreamPhase>(() => {
    const now = Date.now();
    const start = new Date(config.scheduled_start).getTime();
    return now < start ? 'pre-stream' : 'live';
  });

  const [activeVideoId, setActiveVideoId] = useState(config.primary_video_id);
  const [isUsingBackup, setIsUsingBackup] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);

  const switchToBackup = useCallback(() => {
    if (config.backup_video_id && !isUsingBackup) {
      setActiveVideoId(config.backup_video_id);
      setIsUsingBackup(true);
    }
  }, [config.backup_video_id, isUsingBackup]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'pre-stream') {
      setTimeUntilStart(null);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const start = new Date(config.scheduled_start).getTime();
      const remaining = start - now;

      if (remaining <= 0) {
        setPhase('live');
        setTimeUntilStart(0);
        return;
      }

      setTimeUntilStart(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [phase, config.scheduled_start]);

  return {
    phase,
    activeVideoId,
    isUsingBackup,
    timeUntilStart,
    switchToBackup,
    setPhase,
  };
}
