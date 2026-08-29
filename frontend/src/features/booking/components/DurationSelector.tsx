import { Timer, AlertCircle } from 'lucide-react';
import { Card } from '@/components/common';

export interface DurationSelectorProps {
  durationMinutes: number;
  onSelectDuration: (minutes: number) => void;
  disabled?: boolean;
}

const durationOptions = [
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hrs', minutes: 90 },
  { label: '2 hours', minutes: 120 },
  { label: '2.5 hrs', minutes: 150 },
  { label: '3 hours', minutes: 180 },
  { label: '3.5 hrs', minutes: 210 },
  { label: '4 hours', minutes: 240 },
  { label: '4.5 hrs', minutes: 270 },
  { label: '5 hours', minutes: 300 },
];

export default function DurationSelector({
  durationMinutes,
  onSelectDuration,
  disabled = false,
}: DurationSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Timer size={18} className="text-emerald-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Select Duration</h2>
        </div>
        <span className="text-xs text-slate-400">Maximum: 5 hours</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {durationOptions.map((opt) => {
          const isSelected = durationMinutes === opt.minutes;

          return (
            <Card
              key={opt.minutes}
              variant={disabled ? 'default' : 'interactive'}
              role="button"
              tabIndex={disabled ? -1 : 0}
              aria-pressed={isSelected}
              aria-disabled={disabled}
              onClick={() => !disabled && onSelectDuration(opt.minutes)}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectDuration(opt.minutes);
                }
              }}
              className={`p-2.5 text-center text-xs font-semibold transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-2 ring-emerald-500/40 shadow-sm'
                  : disabled
                  ? 'border-slate-800/50 bg-slate-900/30 text-slate-500 opacity-50 cursor-not-allowed'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {opt.label}
            </Card>
          );
        })}
      </div>

      {durationMinutes === 300 && (
        <div className="flex items-center gap-1.5 text-xs text-amber-400/90">
          <AlertCircle size={14} className="shrink-0" />
          <span>Maximum continuous match duration reached (5 hours).</span>
        </div>
      )}
    </div>
  );
}