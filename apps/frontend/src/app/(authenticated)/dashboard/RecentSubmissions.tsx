import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentSubmissionItem {
  id: string;
  problemId: string;
  problemTitle: string;
  problemSlug: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

interface RecentSubmissionsProps {
  recent: RecentSubmissionItem[];
}

export function RecentSubmissions({ recent }: RecentSubmissionsProps) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-card-foreground">
            Recent Submissions
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Your latest submissions on problems
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No submissions yet. Start coding to build history!
          </div>
        ) : (
          recent.map((sub, idx) => {
            const statusColors = {
              ACCEPTED: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
              WRONG_ANSWER: 'text-red-500 border-red-500/20 bg-red-500/10',
              TIME_LIMIT_EXCEEDED: 'text-orange-500 border-orange-500/20 bg-orange-500/10',
              RUNTIME_ERROR: 'text-muted-foreground border-border bg-muted',
              COMPILATION_ERROR: 'text-muted-foreground border-border bg-muted',
              PENDING: 'text-muted-foreground border-border bg-muted',
              PROCESSING: 'text-blue-500 border-blue-500/20 bg-blue-500/10 animate-pulse',
            };

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-border hover:bg-secondary transition-all duration-200 group"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <Link
                    href={`/problems/${sub.problemSlug}`}
                    className="font-bold text-card-foreground text-xs hover:text-blue-500 transition-colors flex items-center gap-1"
                  >
                    {sub.problemTitle}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {new Date(sub.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[9px] font-bold px-2 py-0.5 rounded-full border',
                      statusColors[sub.status as keyof typeof statusColors] || statusColors.PENDING,
                    )}
                  >
                    {sub.status.replace(/_/g, ' ')}
                  </span>
                  <DifficultyBadge difficulty={sub.difficulty} />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
