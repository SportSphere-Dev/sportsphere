import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import { Sparkles, AlertCircle, RotateCcw, CalendarX } from 'lucide-react';
import { PageTransition, FadeIn } from '@/components/motion';
import {
  DateSelector,
  SlotGrid,
  DurationSelector,
  PlayerCountSelector,
  AddOnsSelector,
  BookingSummary,
  getSlots,
} from '@/features/booking';
import { Badge, Button } from '@/components/common';
import { LoadingSpinner, EmptyState } from '@/components/feedback';
import type { Slot } from '@/types';

// Default sportId for the single venue facility
const DEFAULT_SPORT_ID = 1;

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [playerCount, setPlayerCount] = useState<number>(10);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [slotError, setSlotError] = useState<string | null>(null);

  const fetchSlots = useCallback(async (date: Date, signal?: AbortSignal) => {
    setIsLoadingSlots(true);
    setSlotError(null);

    const formattedDate = format(date, 'yyyy-MM-dd');

    try {
      const fetchedSlots = await getSlots({
        sportId: DEFAULT_SPORT_ID,
        date: formattedDate,
        signal,
      });

      setSlots(fetchedSlots);
      setSelectedSlot(null); // Reset selection when slot dataset updates
    } catch (err: unknown) {
      if (axios.isCancel(err)) {
        // Request was cancelled due to date change; ignore
        return;
      }
      setSlots([]);
      setSelectedSlot(null);
      setSlotError('Unable to load available slots. Please check your connection and try again.');
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSlots(selectedDate, controller.signal);

    return () => {
      controller.abort();
    };
  }, [selectedDate, fetchSlots]);

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRetry = () => {
    fetchSlots(selectedDate);
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <FadeIn direction="up">
          <div className="mb-8 border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="brand" className="px-2 py-0.5 text-xs">
                <Sparkles size={13} className="mr-1 inline" />
                TURF SCHEDULING
              </Badge>
              <span className="text-xs text-slate-400">Live Availability Selection</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Reserve Your Match Slot
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Select date, start time, match duration, and add-on gear for your game.
            </p>
          </div>
        </FadeIn>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left: Interactive Selection Flow (Col 8) */}
          <div className="space-y-8 lg:col-span-8">
            <FadeIn direction="up" delay={0.05}>
              <DateSelector
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                }}
              />
            </FadeIn>

            {/* Real Slot Availability Grid / Loading / Error / Empty States */}
            <FadeIn direction="up" delay={0.1}>
              {isLoadingSlots ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8">
                  <LoadingSpinner size="md" label="Loading available slots..." />
                </div>
              ) : slotError ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center">
                  <AlertCircle size={32} className="text-rose-400 mb-2" />
                  <p className="text-sm font-semibold text-white">{slotError}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-4"
                    leftIcon={<RotateCcw size={14} />}
                  >
                    Retry
                  </Button>
                </div>
              ) : slots.length === 0 ? (
                <EmptyState
                  title="No slots available for this date"
                  description="All slots are either fully booked or unavailable. Please select another date from the calendar."
                  icon={<CalendarX size={24} className="text-slate-400" />}
                />
              ) : (
                <SlotGrid
                  slots={slots}
                  selectedSlotId={selectedSlot?.id || null}
                  onSelectSlot={(slot) => setSelectedSlot(slot)}
                />
              )}
            </FadeIn>

            <FadeIn direction="up" delay={0.15}>
              <DurationSelector
                durationMinutes={durationMinutes}
                onSelectDuration={setDurationMinutes}
                disabled={!selectedSlot}
              />
            </FadeIn>

            <FadeIn direction="up" delay={0.2}>
              <PlayerCountSelector
                playerCount={playerCount}
                onChangePlayerCount={setPlayerCount}
              />
            </FadeIn>

            <FadeIn direction="up" delay={0.25}>
              <AddOnsSelector
                selectedAddOns={selectedAddOns}
                onToggleAddOn={handleToggleAddOn}
              />
            </FadeIn>
          </div>

          {/* Right: Sticky Summary (Col 4) */}
          <div className="lg:col-span-4">
            <FadeIn direction="up" delay={0.2}>
              <BookingSummary
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                durationMinutes={durationMinutes}
                playerCount={playerCount}
                selectedAddOnsCount={selectedAddOns.length}
              />
            </FadeIn>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}