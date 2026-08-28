import { Info } from 'lucide-react';
import { Card } from '@/components/common';

const rules = [
  'Booking window opens 5 days in advance of the match date.',
  'Bookings must be secured at least 30 minutes before slot start time.',
  'Maximum booking duration is 5 consecutive hours.',
  'Selected slots are held temporarily for 5 minutes during checkout.',
];

export default function BookingRulesPreview() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-slate-800 bg-slate-900/60 p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-emerald-400">
                <Info size={18} aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider">Good to Know</span>
              </div>
              <h3 className="mt-2 text-xl font-bold text-white">Booking Guidelines</h3>
              <p className="mt-1 text-xs text-slate-400">
                Key operational policies enforced to ensure fair court access for every team.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-2xl">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}