/**
 * Generate a URL-friendly slug from a string.
 * @example slugify("Two Sum Problem") => "two-sum-problem"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format a date to a human-readable string.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a relative time string (e.g., "2 hours ago").
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100] as const;

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function getUtcDayDifference(from: Date, to: Date): number {
  const fromDay = startOfUtcDay(from);
  const toDay = startOfUtcDay(to);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((toDay.getTime() - fromDay.getTime()) / millisecondsPerDay);
}

export function getCurrentStreakState(
  streak: number,
  lastActiveAt?: Date | string | null,
  now: Date = new Date(),
): number {
  if (!lastActiveAt) {
    return 0;
  }

  const lastActiveDate = lastActiveAt instanceof Date ? lastActiveAt : new Date(lastActiveAt);
  return getUtcDayDifference(lastActiveDate, now) > 1 ? 0 : streak;
}

export function getAcceptedSubmissionStreakUpdate(
  streak: number,
  lastActiveAt?: Date | string | null,
  now: Date = new Date(),
): {
  streak: number;
  milestone: number | null;
} {
  if (!lastActiveAt) {
    const nextStreak = 1;
    return {
      streak: nextStreak,
      milestone: STREAK_MILESTONES.includes(nextStreak as (typeof STREAK_MILESTONES)[number])
        ? nextStreak
        : null,
    };
  }

  const lastActiveDate = lastActiveAt instanceof Date ? lastActiveAt : new Date(lastActiveAt);
  const dayDifference = getUtcDayDifference(lastActiveDate, now);

  let nextStreak = streak;
  if (dayDifference === 1) {
    nextStreak += 1;
  } else if (dayDifference > 1) {
    nextStreak = 1;
  }

  return {
    streak: nextStreak,
    milestone:
      nextStreak !== streak &&
      STREAK_MILESTONES.includes(nextStreak as (typeof STREAK_MILESTONES)[number])
        ? nextStreak
        : null,
  };
}
