import { useState } from 'react';
import { PageTransition, FadeIn } from '@/components/motion';
import {
  DateSelector,
  SlotGrid,
  DurationSelector,
  PlayerCountSelector,
  AddOnsSelector,
  BookingSummary,
  type DisplaySlot,
} from '@/features/booking';
import { Badge } from '@/components/common';
import { Sparkles } from 'lucide-react';

const DEMO_SLOTS: DisplaySlot[] = [
  // Morning
  { id: 'slot-1', time: '07:00 AM', period: 'Morning', status: 'available' },
  { id: 'slot-2', time: '08:00 AM', period: 'Morning', status: 'available' },
  { id: 'slot-3', time: '09:00 AM', period: 'Morning', status: 'booked' },
  { id: 'slot-4', time: '10:00 AM', period: 'Morning', status: 'available' },
  // Afternoon
  { id: 'slot-5', time: '01:00 PM', period: 'Afternoon', status: 'available' },
  { id: 'slot-6', time: '02:00 PM', period: 'Afternoon', status: 'blocked' },
  { id: 'slot-7', time: '03:00 PM', period: 'Afternoon', status: 'available' },
  { id: 'slot-8', time: '04:00 PM', period: 'Afternoon', status: 'available' },
  // Evening / Peak
  { id: 'slot-9', time: '06:00 PM', period: 'Evening', status: 'available', isPeak: true },
  { id: 'slot-10', time: '07:00 PM', period: 'Evening', status: 'held', isPeak: true },
  { id: 'slot-11', time: '08:00 PM', period: 'Evening', status: 'available', isPeak: true },
  { id: 'slot-12', time: '09:00 PM', period: 'Evening', status: 'booked', isPeak: true },
];

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<DisplaySlot | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [playerCount, setPlayerCount] = useState<number>(10);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const handleToggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
                  setSelectedSlot(null); // Reset slot selection on date change
                }}
              />
            </FadeIn>

            <FadeIn direction="up" delay={0.1}>
              <SlotGrid
                slots={DEMO_SLOTS}
                selectedSlotId={selectedSlot?.id || null}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
              />
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