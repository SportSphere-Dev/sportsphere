import React, { HTMLAttributes } from 'react';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center ${className}`}
      {...props}
    >
      <div className="mb-3 rounded-full bg-slate-800/80 p-3 text-slate-400" aria-hidden="true">
        {icon || <Inbox size={24} />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}