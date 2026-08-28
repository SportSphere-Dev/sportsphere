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
    default: 'bg-slate-900/80 border-slate-800/80',
    elevated: 'bg-slate-900 border-slate-700/60 shadow-lg shadow-black/40',
    interactive:
      'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-colors duration-150 cursor-pointer',
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