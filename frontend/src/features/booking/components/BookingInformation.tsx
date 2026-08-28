import { CalendarRange, CreditCard, Shield } from 'lucide-react';
import { Card } from '@/components/common';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import CancellationPolicyVisual from './CancellationPolicyVisual';

const bookingRules = [
  {
    category: 'Booking & Timing',
    icon: CalendarRange,
    items: [
      'Advance Window: Slots open 5 days ahead of match date.',
      'Lead Time: Book at least 30 minutes before slot start.',
      'Duration: Reserve 1-hour sessions up to 5 consecutive hours.',
      'Player Limit: 15 players standard capacity.',
    ],
  },
  {
    category: 'Payment & Slot Hold',
    icon: CreditCard,
    items: [
      '5-Minute Hold: Selected slot is held during checkout.',
      'Zero Double-Booking: Instant reservation confirmation.',
      'Auto-Release: Expired checkout immediately frees the slot.',
      'Dynamic Pricing: Peak evenings and weekend rates apply.',
    ],
  },
  {
    category: 'Account & Security',
    icon: Shield,
    items: [
      'Verification: Phone & Email OTP verification required.',
      'Group Lead: One customer creates booking for the group.',
      'Reminders: Automated match notifications sent prior to slot.',
      'Maintenance: Slots blocked up to 2 days ahead for upkeep.',
    ],
  },
];

export default function BookingInformation() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Policies & Rules</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Venue Guidelines & Policies
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Clear operational standards governing slots, checkouts, and match etiquette.
            </p>
          </div>
        </FadeIn>

        {/* Grouped Rules Grid */}
        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {bookingRules.map((group) => {
            const Icon = group.icon;
            return (
              <StaggerItem key={group.category}>
                <Card variant="interactive" className="flex h-full flex-col p-6">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400" aria-hidden="true">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{group.category}</h3>
                  </div>

                  <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
                    {group.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Cancellation Visual Timeline */}
        <CancellationPolicyVisual />
      </div>
    </section>
  );
}