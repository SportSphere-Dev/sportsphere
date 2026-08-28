import { Clock, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import type { SlotStatus } from '@/types';

export interface DisplaySlot {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  status: SlotStatus;
  isPeak?: boolean;
}

export interface SlotGridProps {
  slots: DisplaySlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: DisplaySlot) => void;
}

export default function SlotGrid({ slots, selectedSlotId, onSelectSlot }: SlotGridProps) {
  const periods: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening'];

  const getStatusBadge = (slot: DisplaySlot) => {
    switch (slot.status) {
      case 'available':
        return slot.isPeak ? (
          <Badge variant="warning" className="text-[10px]">Peak</Badge>
        ) : (
          <Badge variant="success" className="text-[10px]">Available</Badge>
        );
      case 'held':
        return <Badge variant="warning" className="text-[10px]">Held</Badge>;
      case 'booked':
        return <Badge variant="neutral" className="text-[10px]">Booked</Badge>;
      case 'blocked':
        return <Badge variant="error" className="text-[10px]">Blocked</Badge>;
    }
  };

  const getStatusIcon = (status: SlotStatus) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 size={13} className="text-emerald-400" aria-hidden="true" />;
      case 'held':
        return <Clock size={13} className="text-amber-400" aria-hidden="true" />;
      case 'booked':
        return <Lock size={13} className="text-slate-500" aria-hidden="true" />;
      case 'blocked':
        return <ShieldAlert size={13} className="text-rose-400" aria-hidden="true" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-emerald-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Select Start Slot</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Peak / Held
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-600" /> Booked
          </span>
        </div>
      </div>

      {periods.map((period) => {
        const periodSlots = slots.filter((s) => s.period === period);
        if (periodSlots.length === 0) return null;

        return (
          <div key={period} className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {period}
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {periodSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isAvailable = slot.status === 'available';

                return (
                  <Card
                    key={slot.id}
                    variant={isAvailable ? 'interactive' : 'default'}
                    role="button"
                    tabIndex={isAvailable ? 0 : -1}
                    aria-pressed={isSelected}
                    aria-disabled={!isAvailable}
                    onClick={() => isAvailable && onSelectSlot(slot)}
                    onKeyDown={(e) => {
                      if (isAvailable && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        onSelectSlot(slot);
                      }
                    }}
                    className={`flex flex-col justify-between p-3 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/50'
                        : !isAvailable
                        ? 'border-slate-800/40 bg-slate-900/30 opacity-50 cursor-not-allowed'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{slot.time}</span>
                      {getStatusIcon(slot.status)}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{slot.period}</span>
                      {getStatusBadge(slot)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}