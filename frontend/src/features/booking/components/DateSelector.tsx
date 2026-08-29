import { addDays, format, isSameDay } from 'date-fns';
import { Calendar, Info } from 'lucide-react';
import { Card } from '@/components/common';

export interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onSelectDate }: DateSelectorProps) {
  // Generate the 5-day advance booking window dynamically
  const dates = Array.from({ length: 5 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-emerald-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Select Match Date</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info size={13} className="text-emerald-400" aria-hidden="true" />
          <span>Booking window opens 5 days in advance</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 overflow-x-auto pb-1 sm:gap-3">
        {dates.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = idx === 0;

          return (
            <Card
              key={date.toISOString()}
              variant="interactive"
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => onSelectDate(date)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDate(date);
                }
              }}
              className={`flex flex-col items-center justify-center p-3 text-center transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-emerald-950/40'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isToday ? 'Today' : format(date, 'EEE')}
              </span>
              <span className="my-0.5 text-lg font-extrabold text-white">
                {format(date, 'dd')}
              </span>
              <span className="text-[10px] text-slate-400">
                {format(date, 'MMM')}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}