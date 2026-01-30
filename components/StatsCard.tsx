import React from 'react';

interface StatsCardProps {
  title: string;
  current: number;
  total: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, current, total }) => {
  return (
    <div className="bg-white px-5 py-4 rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col min-w-[180px] hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-default">
      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2 group-hover:text-blue-600 transition-colors">{title}</span>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl font-bold text-slate-800 tabular-nums tracking-tight">{current}</span>
        <span className="text-slate-400 text-sm font-medium">/ {total}</span>
      </div>
    </div>
  );
};