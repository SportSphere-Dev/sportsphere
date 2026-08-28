import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
}

export default function Card({
  variant = 'default',
  children,
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-slate-900/80 border-slate-800/80 transition-colors duration-200',
    elevated:
      'bg-slate-900 border-slate-700/60 shadow-lg shadow-black/40 hover:border-slate-600/80 transition-all duration-200',
    interactive:
      'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-200 cursor-pointer will-change-transform',
  };

  return (
    <div
      className={`rounded-xl border p-5 text-slate-100 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}