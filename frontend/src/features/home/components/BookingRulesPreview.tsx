import { Info, Clock, CheckCircle, ShieldAlert } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { FadeIn } from '@/components/motion';

const rules = [
  'Booking window opens 5 days in advance of the match date.',
  'Bookings must be secured at least 30 minutes before slot start time.',
  'Maximum booking duration is 5 consecutive hours.',
  'Selected slots are held temporarily for 5 minutes during checkout.',
];

const mockTimeline = [
  { time: '07:00 AM', status: 'available', type: 'Standard' },
  { time: '08:00 AM', status: 'available', type: 'Standard' },
  { time: '05:00 PM', status: 'booked', type: 'Reserved' },
  { time: '06:00 PM', status: 'peak', type: 'Prime Peak' },
  { time: '07:00 PM', status: 'available', type: 'Prime Peak' },
  { time: '08:00 PM', status: 'held', type: 'Held (5m)' },
];

export default function BookingRulesPreview() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <Card className="border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              
              {/* Left Column: Guidelines */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Info size={18} aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider">Guidelines</span>
                </div>
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  Booking Guidelines & Policies
                </h3>
                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  Key operational rules enforced to ensure fair court access and seamless coordination.
                </p>

                <div className="mt-6 space-y-3">
                  {rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-slate-800/90 bg-slate-950/70 p-3.5 text-xs text-slate-300"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Visual Schedule Concept Grid */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-emerald-400" />
                      <span className="text-xs font-semibold text-slate-200">Interactive Timeline Concept</span>
                    </div>
                    <Badge variant="neutral" className="text-[10px]">Visual Preview</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {mockTimeline.map((slot) => {
                      const isAvailable = slot.status === 'available';
                      const isPeak = slot.status === 'peak';
                      const isBooked = slot.status === 'booked';
                      const isHeld = slot.status === 'held';

                      return (
                        <div
                          key={slot.time}
                          className={`flex flex-col justify-between rounded-xl border p-3 transition-colors ${
                            isAvailable
                              ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                              : isPeak
                              ? 'border-amber-500/30 bg-amber-950/20 text-amber-300'
                              : isHeld
                              ? 'border-purple-500/30 bg-purple-950/20 text-purple-300'
                              : 'border-slate-800/60 bg-slate-900/30 text-slate-500 opacity-60'
                          }`}
                        >
                          <span className="text-xs font-bold text-white">{slot.time}</span>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] font-medium">{slot.type}</span>
                            {isAvailable && <CheckCircle size={12} className="text-emerald-400" />}
                            {isPeak && <CheckCircle size={12} className="text-amber-400" />}
                            {isHeld && <Clock size={12} className="text-purple-400" />}
                            {isBooked && <ShieldAlert size={12} className="text-slate-500" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-center text-[11px] text-slate-500">
                    Live pricing and real-time slots unlock dynamically upon choosing a game date.
                  </p>
                </div>
              </div>

            </div>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}