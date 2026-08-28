import { Link } from 'react-router-dom';
import { ArrowRight, CalendarRange, Clock, ShieldAlert } from 'lucide-react';
import { Button, Card } from '@/components/common';

const bookingRules = [
  {
    title: '5-Day Booking Window',
    description: 'Slot availability opens 5 days in advance of the match date.',
    icon: CalendarRange,
  },
  {
    title: '30-Minute Lead Time',
    description: 'Bookings must be confirmed at least 30 minutes before the slot starts.',
    icon: Clock,
  },
  {
    title: 'Max 5-Hour Duration',
    description: 'Single match sessions or consecutive blocks can be booked up to 5 hours.',
    icon: ShieldAlert,
  },
];

export default function BookingInformation() {
  return (
    <section className="bg-slate-950 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 shadow-xl shadow-black/40">
          <div className="max-w-xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Reservation Policies</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Booking Guidelines
            </p>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Review operational guidelines before choosing your preferred time slots.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {bookingRules.map((rule) => {
              const Icon = rule.icon;
              return (
                <Card key={rule.title} className="border-slate-800/80 bg-slate-950/60 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-800 p-2 text-emerald-400" aria-hidden="true">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{rule.title}</h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">{rule.description}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 sm:flex-row">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Slots are temporarily held for 5 minutes during checkout to ensure zero double-booking.
            </p>
            <Link to="/booking" className="w-full sm:w-auto">
              <Button size="md" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} aria-hidden="true" />}>
                View Available Slots
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}