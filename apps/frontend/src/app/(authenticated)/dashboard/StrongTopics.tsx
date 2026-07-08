import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StrongTopics() {
  // Mock data for top 3 strongest topics
  const topics = [
    { name: 'Arrays', score: 95, color: 'bg-emerald-500' },
    { name: 'Strings', score: 88, color: 'bg-blue-500' },
    { name: 'Hash Tables', score: 82, color: 'bg-orange-500' },
  ];

  return (
    <Card className="bg-card border-border rounded-[16px] shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-card-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" /> Strong Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {topics.map((topic, idx) => (
          <div key={idx} className="space-y-2 group">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-card-foreground group-hover:opacity-80 transition-opacity">
                {topic.name}
              </span>
              <span className="font-bold text-muted-foreground">{topic.score}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden relative">
              <div
                className={cn('h-full rounded-full transition-all duration-700', topic.color)}
                style={{ width: `${topic.score}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
