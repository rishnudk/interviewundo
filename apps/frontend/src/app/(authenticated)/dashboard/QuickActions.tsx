import React from 'react';
import Link from 'next/link';
import { PlayCircle, Flame, Shuffle, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function QuickActions() {
  const actions = [
    {
      label: 'Continue Practice',
      description: 'Resume from where you left off',
      icon: PlayCircle,
      href: '/problems',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      hoverBorder: 'hover:border-blue-500/50',
    },
    {
      label: 'Daily Challenge',
      description: "Solve today's problem for extra XP",
      icon: Flame,
      href: '/problems?filter=daily',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      hoverBorder: 'hover:border-orange-500/50',
    },
    {
      label: 'Random Problem',
      description: 'Test yourself with a random challenge',
      icon: Shuffle,
      href: '/problems/random',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      hoverBorder: 'hover:border-emerald-500/50',
    },
    {
      label: 'AI Assistant',
      description: 'Get help or mock an interview',
      icon: Bot,
      href: '/ai-assistant',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      hoverBorder: 'hover:border-purple-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link href={action.href} key={idx} className="block group">
            <Card
              className={`h-full bg-card border-border rounded-[16px] shadow-sm hover:shadow-md transition-all duration-300 ${action.hoverBorder} hover:-translate-y-1`}
            >
              <CardContent className="p-5 flex flex-col items-start gap-4">
                <div
                  className={`p-3 rounded-2xl ${action.bg} ${action.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={24} className="stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-card-foreground">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
