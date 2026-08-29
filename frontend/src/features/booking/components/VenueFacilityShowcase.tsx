import { MapPin, Phone, Users, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/motion';

import img2 from '@/assets/venue/2.jpeg';
import img4 from '@/assets/venue/4.jpg';
import img3 from '@/assets/venue/3.jpg';
import img5 from '@/assets/venue/5.jpg';

const facilityCards = [
  {
    title: 'Location & Address',
    description: 'Direct venue address and navigation details will be published upon final commercial setup.',
    value: 'Venue details coming soon',
    icon: MapPin,
    image: img5,
    isPlaceholder: true,
  },
  {
    title: 'Venue Contact',
    description: 'Dedicated support hotline and manager desk details will be available for active bookings.',
    value: 'Direct contact coming soon',
    icon: Phone,
    image: img3,
    isPlaceholder: true,
  },
  {
    title: 'Match Capacity',
    description: 'Standard slot covers up to 15 players. Additional players can be accommodated at the centre.',
    value: 'Up to 15 Players',
    icon: Users,
    image: img4,
    isPlaceholder: false,
  },
  {
    title: 'Arena Surface',
    description: 'Synthetic turf optimized for multi-sport sessions, friendly tournaments, and practice blocks.',
    value: 'High-Density Synthetic Turf',
    icon: ShieldCheck,
    image: img2,
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
                <Card variant="interactive" className="flex h-full flex-col justify-between overflow-hidden p-0 border-slate-800 bg-slate-900/80">
                  {/* Image Header */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-slate-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <div className="rounded-lg bg-slate-950/80 p-2 text-emerald-400 backdrop-blur-md" aria-hidden="true">
                        <Icon size={16} />
                      </div>
                      {item.isPlaceholder && (
                        <Badge variant="neutral" className="text-[10px]">
                          Pending Setup
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className={`mt-1 text-xs leading-relaxed ${item.isPlaceholder ? 'italic text-slate-500' : 'text-slate-300'}`}>
                        {item.value}
                      </p>
                    </div>
                    <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{item.description}</p>
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