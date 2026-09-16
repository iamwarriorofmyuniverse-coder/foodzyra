import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  trend?: string;
  color?: 'forest' | 'emerald' | 'amber' | 'blue' | 'purple';
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon,
  trend,
  color = 'forest',
  description
}) => {
  const colorSchemes = {
    forest: 'from-forest-50 to-white text-forest-700 border-forest-150',
    emerald: 'from-emerald-50 to-white text-emerald-700 border-emerald-150',
    amber: 'from-amber-50 to-white text-amber-700 border-amber-150',
    blue: 'from-sky-50 to-white text-sky-700 border-sky-150',
    purple: 'from-purple-50 to-white text-purple-700 border-purple-150'
  };

  const iconBg = {
    forest: 'bg-forest-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    amber: 'bg-amber-500 text-white',
    blue: 'bg-sky-600 text-white',
    purple: 'bg-purple-600 text-white'
  };

  return (
    <div className={`p-5 rounded-2xl border bg-gradient-to-br shadow-sm transition-all duration-300 hover:shadow-md ${colorSchemes[color]}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`p-2.5 rounded-xl shadow-xs ${iconBg[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
      </div>
      {(trend || description) && (
        <div className="mt-2 text-xs text-slate-600 flex items-center justify-between">
          {description && <span>{description}</span>}
          {trend && (
            <span className="inline-flex items-center font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
