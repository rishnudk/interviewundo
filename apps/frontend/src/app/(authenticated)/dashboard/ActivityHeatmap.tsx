import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityHeatmapItem {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  activity: ActivityHeatmapItem[];
}

const getCellColor = (count: number) => {
  if (count === 0) return 'bg-muted hover:bg-muted-foreground/20';
  if (count <= 2) return 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30';
  if (count <= 4) return 'bg-blue-500/50 text-foreground hover:bg-blue-500/60';
  return 'bg-blue-500 text-foreground hover:opacity-80';
};

export function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  // Calculate Calendar Days (last 365 days aligned to weeks)
  const calendarData = useMemo(() => {
    if (!activity) return { weeks: [], monthLabels: [], activityMap: {} };

    const activityMap = activity.reduce(
      (acc, curr) => {
        acc[curr.date] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const days: Date[] = [];
    const today = new Date();

    // Align start to 52 weeks ago, starting on Sunday
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const curr = new Date(startDate);
    while (curr <= today) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Generate month labels positioned at the starting week index
    const monthLabels: { text: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, index) => {
      const firstDay = week[0];
      if (firstDay && firstDay.getMonth() !== lastMonth) {
        lastMonth = firstDay.getMonth();
        monthLabels.push({
          text: firstDay.toLocaleDateString(undefined, { month: 'short' }),
          index,
        });
      }
    });

    return { weeks, monthLabels, activityMap };
  }, [activity]);

  return (
    <Card className="bg-card border-border rounded-[16px] shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-card-foreground flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" /> Submission Activity
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Daily coding activity over the past year
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col">
          {/* Month Headers */}
          <div className="flex gap-[4.5px] text-[10px] font-medium text-muted-foreground h-4 pl-6 relative">
            {calendarData.monthLabels.map((lbl, idx) => (
              <div key={idx} className="absolute" style={{ left: `${lbl.index * 13.5 + 24}px` }}>
                {lbl.text}
              </div>
            ))}
          </div>

          <div className="flex gap-1.5">
            {/* Days label */}
            <div className="flex flex-col justify-between text-[9px] font-medium text-muted-foreground h-[92px] pr-1 py-1">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-x-auto pb-2 scrollbar-thin select-none">
              <div className="flex gap-[2px]">
                {calendarData.weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[2px]">
                    {week.map((day, dIdx) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const count = calendarData.activityMap[dateStr] || 0;
                      const colorClass = getCellColor(count);
                      return (
                        <div
                          key={dIdx}
                          className={cn(
                            'w-[10px] h-[10px] rounded-[1.5px] transition-all hover:scale-125 cursor-pointer relative group',
                            colorClass,
                          )}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-popover text-popover-foreground font-medium text-[10px] py-1.5 px-2 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none border border-border">
                            {count} {count === 1 ? 'submission' : 'submissions'} on{' '}
                            {day.toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-muted-foreground pt-2">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[1.5px] bg-muted" />
            <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-500/20" />
            <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-500/50" />
            <div className="w-2.5 h-2.5 rounded-[1.5px] bg-blue-500" />
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
