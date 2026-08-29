import { format } from 'date-fns';
import { ArrowRight, Calendar, Clock, Users, ShieldCheck, Timer, Zap, AlertCircle } from 'lucide-react';
import { Card, Button, Badge } from '@/components/common';
import type { Slot } from '@/types';

export interface BookingSummaryProps {
  selectedDate: Date;
  selectedSlot: Slot | null;
  durationMinutes: number;
  playerCount: number;
  selectedAddOnsCount: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  onSubmit: () => void;
}

export default function BookingSummary({
  selectedDate,
  selectedSlot,
  durationMinutes,
  playerCount,
  selectedAddOnsCount,
  isLoading = false,
  errorMessage = null,
  onSubmit,
}: BookingSummaryProps) {
  const isComplete = Boolean(selectedSlot);

  return (
    <Card className="sticky top-20 flex flex-col justify-between border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200">
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-tight">Booking Summary</h3>
            <p className="text-xs text-slate-400">Single Venue Turf Session</p>
          </div>
          <Badge variant={isComplete ? 'brand' : 'neutral'} className="text-[10px] px-2">
            {isComplete ? (
              <span className="flex items-center gap-1">
                <Zap size={10} className="inline text-slate-950" /> Ready
              </span>
            ) : (
              'Select Slot'
            )}
          </Badge>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-950/30 p-3 text-xs text-rose-400"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Breakdown Summary Items */}
        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Calendar size={15} className="text-emerald-400" /> Match Date
            </span>
            <span className="font-semibold text-white">{format(selectedDate, 'EEE, dd MMM yyyy')}</span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Clock size={15} className="text-emerald-400" /> Start Slot
            </span>
            <span className={`font-semibold ${selectedSlot ? 'text-emerald-300' : 'text-slate-500 italic'}`}>
              {selectedSlot ? selectedSlot.time : 'No slot chosen'}
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
              <Users size={15} className="text-emerald-400" /> Match Players
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
          Official total price is computed by the backend upon creating the 5-minute hold.
        </div>

        {/* 5-Min Hold Notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-lg">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          <span>Selected slots are temporarily held for 5 minutes during checkout.</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <Button
          size="lg"
          disabled={!isComplete || isLoading}
          isLoading={isLoading}
          onClick={onSubmit}
          className="w-full shadow-xl shadow-emerald-500/25"
          rightIcon={!isLoading && <ArrowRight size={18} aria-hidden="true" />}
        >
          {isLoading ? 'Holding Slot...' : 'Hold Slot & Continue to Payment'}
        </Button>
      </div>
    </Card>
  );
}