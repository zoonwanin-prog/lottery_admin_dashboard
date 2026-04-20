import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red';
  className?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = 'blue',
  className,
}: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  const trendColorClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600',
  };

  return (
    <div className={cn(
      "bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={cn("flex items-center gap-1 mt-3", trendColorClasses[trend])}>
              {trend === 'up' && <TrendingUp size={16} />}
              {trend === 'down' && <TrendingDown size={16} />}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn("p-3 rounded-lg", colorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
