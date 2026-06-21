'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket, useToast } from '@/providers';

type SubmissionStatusPayload = {
  submissionId: string;
  status: string;
  userStreak?: number;
  streakMilestone?: number | null;
};

const terminalStatuses = new Set([
  'ACCEPTED',
  'WRONG_ANSWER',
  'TIME_LIMIT_EXCEEDED',
  'RUNTIME_ERROR',
  'COMPILATION_ERROR',
]);

export function StreakNotificationListener() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  const { success } = useToast();
  const notifiedSubmissions = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleStatusUpdate = (payload: SubmissionStatusPayload) => {
      if (!terminalStatuses.has(payload.status)) {
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dailyChallenge'] });

      if (payload.status !== 'ACCEPTED') {
        return;
      }

      if (notifiedSubmissions.current.has(payload.submissionId)) {
        return;
      }
      notifiedSubmissions.current.add(payload.submissionId);

      if (payload.streakMilestone) {
        success(
          `Milestone reached: ${payload.streakMilestone}-day coding streak. Outstanding work.`,
          6000,
        );
        return;
      }

      if (payload.userStreak && payload.userStreak > 0) {
        success(
          `Streak extended: ${payload.userStreak} ${payload.userStreak === 1 ? 'day' : 'days'} in a row.`,
          4500,
        );
      }
    };

    socket.on('submission:status', handleStatusUpdate);

    return () => {
      socket.off('submission:status', handleStatusUpdate);
    };
  }, [queryClient, socket, success]);

  return null;
}
