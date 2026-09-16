import React from 'react';
import { Sparkles, Heart, Leaf, ShieldCheck, Clock, MapPin } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'donation' | 'sale' | 'dietary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl gap-2 font-semibold'
  };

  const variantClasses = {
    primary: 'bg-forest-100 text-forest-800 border border-forest-200',
    secondary: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border border-rose-200',
    donation: 'bg-emerald-600 text-white font-semibold shadow-sm',
    sale: 'bg-amber-500 text-white font-bold shadow-sm',
    dietary: 'bg-white text-forest-900 border border-forest-200/80 shadow-xs'
  };

  return (
    <span
      className={`inline-flex items-center justify-center transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
