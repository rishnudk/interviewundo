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
    <Card className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#ffffff]">Recent Submissions</CardTitle>
          <CardDescription className="text-xs text-[#868f97]">
            Your latest submissions on problems
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recent.length === 0 ? (
          <div className="text-center py-6 text-sm text-[#868f97]">
            No submissions yet. Start coding to build history!
          </div>
        ) : (
          recent.map((sub, idx) => {
            const statusColors = {
              ACCEPTED: 'text-[#4ebe96] border-[#4ebe96]/20 bg-[#4ebe96]/10',
              WRONG_ANSWER: 'text-[#eb5757] border-[#eb5757]/20 bg-[#eb5757]/10',
              TIME_LIMIT_EXCEEDED: 'text-[#ffa16c] border-[#ffa16c]/20 bg-[#ffa16c]/10',
              RUNTIME_ERROR: 'text-[#cccccc] border-white/20 bg-white/5',
              COMPILATION_ERROR: 'text-[#868f97] border-white/20 bg-white/5',
              PENDING: 'text-[#868f97] border-white/10 bg-white/5',
              PROCESSING: 'text-[#479ffa] border-[#479ffa]/20 bg-[#479ffa]/10 animate-pulse',
            };

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-white/5 hover:bg-[#131313] transition-all duration-200 group"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-3">
                  <Link
                    href={`/problems/${sub.problemSlug}`}
                    className="font-bold text-[#ffffff] text-xs hover:text-[#479ffa] transition-colors flex items-center gap-1"
                  >
                    {sub.problemTitle}
                    <ExternalLink
                      size={10}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                  <p className="text-[10px] text-[#868f97] font-medium">
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
