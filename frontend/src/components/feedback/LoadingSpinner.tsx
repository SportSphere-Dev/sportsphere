import { HTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
};

export default function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
  className = '',
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={`flex flex-col items-center justify-center gap-2 text-slate-400 ${className}`}
      {...props}
    >
      <Loader2 size={sizeMap[size]} className="animate-spin text-emerald-500" />
      {label && <span className="text-xs font-medium text-slate-500">{label}</span>}
      <span className="sr-only">{label}</span>
    </div>
  );
}