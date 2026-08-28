import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock, Users, ShieldCheck, Timer } from 'lucide-react';
import { Card, Button, Badge } from '@/components/common';
import type { DisplaySlot } from './SlotGrid';

export interface BookingSummaryProps {
  selectedDate: Date;
  selectedSlot: DisplaySlot | null;
  durationMinutes: number;
  playerCount: number;
  selectedAddOnsCount: number;
}

export default function BookingSummary({
  selectedDate,
  selectedSlot,
  durationMinutes,
  playerCount,
  selectedAddOnsCount,
}: BookingSummaryProps) {
  const isComplete = Boolean(selectedSlot);

  return (
    <Card className="sticky top-20 flex flex-col justify-between border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Booking Summary</h3>
            <p className="text-xs text-slate-400">Single Venue Turf Session</p>
          </div>
          <Badge variant={isComplete ? 'brand' : 'neutral'} className="text-[10px]">
            {isComplete ? 'Selection Ready' : 'Pending Selection'}
          </Badge>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Calendar size={15} className="text-emerald-400" /> Date
            </span>
            <span className="font-semibold text-white">{format(selectedDate, 'EEE, dd MMM yyyy')}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Clock size={15} className="text-emerald-400" /> Start Slot
            </span>
            <span className="font-semibold text-white">
              {selectedSlot ? selectedSlot.time : 'Select a slot'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Timer size={15} className="text-emerald-400" /> Duration
            </span>
            <span className="font-semibold text-white">
              {durationMinutes / 60} {durationMinutes === 60 ? 'hour' : 'hours'} ({durationMinutes} min)
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Users size={15} className="text-emerald-400" /> Players
            </span>
            <span className="font-semibold text-white">
              {playerCount} {playerCount === 1 ? 'player' : 'players'}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Add-on Materials</span>
            <span className="font-semibold text-white">
              {selectedAddOnsCount > 0 ? `${selectedAddOnsCount} selected` : 'None'}
            </span>
          </div>
        </div>

        {/* Pricing Notice */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-center text-xs text-slate-400">
          Pricing will be calculated when venue pricing is configured.
        </div>

        {/* 5-Min Hold Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span>Selected slots are held for 5 minutes during checkout.</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <Link to="/payment" tabIndex={isComplete ? 0 : -1} className="block w-full">
          <Button
            size="lg"
            disabled={!isComplete}
            className="w-full shadow-lg shadow-emerald-500/20"
            rightIcon={<ArrowRight size={18} aria-hidden="true" />}
          >
            Continue to Payment
          </Button>
        </Link>
      </div>
    </Card>
  );
}