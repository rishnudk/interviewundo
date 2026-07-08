import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export function InterviewReadiness() {
  const readinessScore = 78; // Mock data
  const metrics = [
    { label: 'Accuracy', value: 85, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Consistency', value: 92, color: 'bg-blue-500', text: 'text-blue-500' },
    { label: 'Topic Coverage', value: 65, color: 'bg-orange-500', text: 'text-orange-500' },
    { label: 'Difficulty', value: 70, color: 'bg-purple-500', text: 'text-purple-500' },
  ];

  const data = [
    { name: 'Score', value: readinessScore },
    { name: 'Remaining', value: 100 - readinessScore },
  ];
  const COLORS = ['#7C3AED', 'rgba(128,128,128,0.2)'];

  return (
    <Card className="bg-card border-border rounded-[16px] shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-base font-bold text-card-foreground flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-500" /> Interview Readiness
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-card-foreground tracking-tight">
                {readinessScore}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Score
              </span>
            </div>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((metric, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[12px] text-muted-foreground">
                    {metric.label}
                  </span>
                  <span className={cn('font-bold text-[12px]', metric.text)}>{metric.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-1000', metric.color)}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
