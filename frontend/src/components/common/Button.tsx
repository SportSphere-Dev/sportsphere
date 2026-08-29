import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-[0.98] active:bg-emerald-600 focus-visible:ring-emerald-400 shadow-sm shadow-emerald-950/50',
  secondary:
    'bg-slate-800 text-slate-200 font-medium hover:bg-slate-700 hover:border-slate-600 active:scale-[0.98] active:bg-slate-750 border border-slate-700 focus-visible:ring-slate-400',
  danger:
    'bg-rose-600 text-white font-medium hover:bg-rose-500 active:scale-[0.98] active:bg-rose-700 focus-visible:ring-rose-400 shadow-sm shadow-rose-950/50',
  ghost:
    'text-slate-300 font-medium hover:bg-slate-800/80 hover:text-white active:scale-[0.98] active:bg-slate-800 focus-visible:ring-slate-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-md',
  md: 'text-sm px-4 py-2 gap-2 rounded-lg',
  lg: 'text-base px-5 py-2.5 gap-2.5 rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`inline-flex items-center justify-center transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin text-current" size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0 transition-transform duration-150 group-hover:-translate-x-0.5" aria-hidden="true">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">{rightIcon}</span>
      )}
    </button>
  );
}