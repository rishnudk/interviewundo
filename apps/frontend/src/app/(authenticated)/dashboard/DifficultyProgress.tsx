import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DifficultyBreakdown {
  solved: number;
  total: number;
}

interface DifficultyProgressProps {
  difficultyBreakdown: {
    EASY: DifficultyBreakdown;
    MEDIUM: DifficultyBreakdown;
    HARD: DifficultyBreakdown;
  };
}

export function DifficultyProgress({ difficultyBreakdown }: DifficultyProgressProps) {
  return (
    <Card className="bg-[#191919] border-white/5 rounded-[16px] shadow-[0_0_44px_rgba(0,0,0,0.8)]">
      <CardHeader>
        <CardTitle className="text-base font-bold text-[#ffffff] flex items-center gap-2">
          <Target className="w-5 h-5 text-[#479ffa]" /> Difficulty Progress
        </CardTitle>
        <CardDescription className="text-xs text-[#868f97]">
          Breakdown of solved problems by difficulty level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {(['EASY', 'MEDIUM', 'HARD'] as const).map((diff) => {
          const breakdown = difficultyBreakdown[diff];
          const solved = breakdown?.solved || 0;
          const total = breakdown?.total || 0;
          const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

          const colorMap = {
            EASY: 'bg-[#4ebe96]',
            MEDIUM: 'bg-[#ffa16c]',
            HARD: 'bg-[#eb5757]',
          };

          const textMap = {
            EASY: 'text-[#4ebe96]',
            MEDIUM: 'text-[#ffa16c]',
            HARD: 'text-[#eb5757]',
          };

          return (
            <div key={diff} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span
                  className={cn('font-bold text-[11px] uppercase tracking-wider', textMap[diff])}
                >
                  {diff}
                </span>
                <span className="font-semibold text-[#ffffff]">
                  {solved}{' '}
                  <span className="text-[11px] font-medium text-[#868f97]">/ {total} solved</span>
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', colorMap[diff])}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
