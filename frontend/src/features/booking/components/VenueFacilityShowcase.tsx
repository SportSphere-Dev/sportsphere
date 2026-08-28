import { MapPin, Phone, Users, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

const facilityCards = [
  {
    title: 'Location & Address',
    description: 'Direct venue address and navigation details will be published upon final commercial setup.',
    value: 'Venue details coming soon',
    icon: MapPin,
    isPlaceholder: true,
  },
  {
    title: 'Venue Contact',
    description: 'Dedicated support hotline and manager desk details will be available for active bookings.',
    value: 'Direct contact coming soon',
    icon: Phone,
    isPlaceholder: true,
  },
  {
    title: 'Match Capacity',
    description: 'Standard slot covers up to 15 players. Additional players can be accommodated at the centre.',
    value: 'Up to 15 Players',
    icon: Users,
    isPlaceholder: false,
  },
  {
    title: 'Arena Surface',
    description: 'Synthetic turf optimized for multi-sport sessions, friendly tournaments, and training blocks.',
    value: 'High-Density Synthetic Turf',
    icon: ShieldCheck,
    isPlaceholder: false,
  },
];

export default function VenueFacilityShowcase() {
  return (
    <section id="facility-showcase" className="border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="max-w-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Built for the Game</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Facility Information & Access
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Verified operational details and court capacity for your match session.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {facilityCards.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.title}>
                <Card variant="interactive" className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400" aria-hidden="true">
                        <Icon size={20} />
                      </div>
                      {item.isPlaceholder && (
                        <Badge variant="neutral" className="text-[10px]">
                          Pending Setup
                        </Badge>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
                    <p className={`mt-1.5 text-xs leading-relaxed ${item.isPlaceholder ? 'italic text-slate-500' : 'text-slate-300'}`}>
                      {item.value}
                    </p>
                  </div>
                  <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{item.description}</p>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}