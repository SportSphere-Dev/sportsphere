import { Calendar, Clock, Layers, PlusCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/common';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

const bookingSteps = [
  {
    step: '01',
    title: 'Choose Date',
    description: 'Select your game date within the 5-day advance booking window.',
    icon: Calendar,
  },
  {
    step: '02',
    title: 'Select Slots',
    description: 'Pick available 1-hour slots or consecutive blocks up to 5 hours.',
    icon: Clock,
  },
  {
    step: '03',
    title: 'Choose Duration',
    description: 'Review match duration and ensure timing is at least 30m in advance.',
    icon: Layers,
  },
  {
    step: '04',
    title: 'Add Materials',
    description: 'Include footballs, training bibs, or match gear directly in your request.',
    icon: PlusCircle,
  },
  {
    step: '05',
    title: 'Secure Booking',
    description: '5-minute temporary slot hold during checkout ensures zero double-booking.',
    icon: CheckCircle,
  },
];

export default function BookingExperiencePreview() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-900/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">How You Reserve</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              5-Step Booking Experience
            </p>
            <p className="mt-3 text-sm text-slate-400">
              A structured flow from schedule selection to instant court reservation.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {bookingSteps.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.step}>
                <Card variant="interactive" className="flex h-full flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-emerald-500/25">{step.step}</span>
                      <div className="rounded-lg bg-slate-800 p-2 text-emerald-400" aria-hidden="true">
                        <Icon size={18} />
                      </div>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.description}</p>
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