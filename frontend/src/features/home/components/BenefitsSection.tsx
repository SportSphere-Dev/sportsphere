import { Eye, Clock4, CircleDollarSign, PackagePlus, CalendarSync } from 'lucide-react';
import { Card } from '@/components/common';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

const benefits = [
  {
    title: 'Live Slot Availability',
    description: 'Real-time schedule visibility guarantees no double bookings or manual coordination errors.',
    icon: Eye,
  },
  {
    title: 'Flexible Match Durations',
    description: 'Book matches from single 1-hour sessions up to 5-hour continuous tournament blocks.',
    icon: Clock4,
  },
  {
    title: 'Transparent Pricing',
    description: 'Clear rates accounting for peak hours and weekend slots with zero hidden surcharges.',
    icon: CircleDollarSign,
  },
  {
    title: 'Add-on Gear & Materials',
    description: 'Include footballs, training bibs, and match gear directly into your booking request.',
    icon: PackagePlus,
  },
  {
    title: 'Rescheduling & Self-Service',
    description: 'Easily manage and reschedule active bookings within the designated policy window.',
    icon: CalendarSync,
  },
];

export default function BenefitsSection() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-900/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="max-w-2xl text-left">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Why SportSphere</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Built for Players and Venue Hosts
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Engineered to replace manual register books and messages with structured digital scheduling.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <StaggerItem key={benefit.title}>
                <Card variant="interactive" className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-400" aria-hidden="true">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-semibold text-white">{benefit.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{benefit.description}</p>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}