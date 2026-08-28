import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/common';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

const steps = [
  {
    step: '01',
    title: 'Choose a Date',
    description: 'Browse the 5-day booking window and view live court availability for your preferred day.',
    icon: CalendarDays,
  },
  {
    step: '02',
    title: 'Select Your Slot',
    description: 'Pick consecutive slots up to 5 hours, configure add-on equipment, and hold your selection.',
    icon: Clock,
  },
  {
    step: '03',
    title: 'Confirm Booking',
    description: 'Complete your booking verification and receive instant confirmation details for your match.',
    icon: CheckCircle2,
  },
];

export default function HowItWorks() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Simple Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How SportSphere Works
            </p>
            <p className="mt-3 text-sm text-slate-400">
              A frictionless booking sequence designed to get you onto the turf faster.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.step}>
                <Card variant="interactive" className="relative flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-emerald-500/20">{item.step}</span>
                      <div className="rounded-xl bg-slate-800/90 p-3 text-emerald-400 shadow-inner" aria-hidden="true">
                        <Icon size={20} />
                      </div>
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.description}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="mt-6 hidden text-xs font-semibold text-emerald-500/40 md:block">
                      Step {item.step} → Step {steps[idx + 1].step}
                    </div>
                  )}
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}