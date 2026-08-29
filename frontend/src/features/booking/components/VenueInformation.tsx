import { MapPin, Phone, Users, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '@/components/common';

const venueDetails = [
  {
    label: 'Location & Address',
    value: 'Venue address details coming soon',
    icon: MapPin,
    isPlaceholder: true,
  },
  {
    label: 'Contact & Support',
    value: 'Direct venue contact coming soon',
    icon: Phone,
    isPlaceholder: true,
  },
  {
    label: 'Player Capacity',
    value: 'Standard up to 15 players (additional players charged at the centre)',
    icon: Users,
    isPlaceholder: false,
  },
  {
    label: 'Turf Specifications',
    value: 'High-density synthetic turf with floodlights and match equipment available',
    icon: ShieldCheck,
    isPlaceholder: false,
  },
];

export default function VenueInformation() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-950 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Facility Overview</h2>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Venue Information
          </p>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            Core facility details and arena specifications for your game.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {venueDetails.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400" aria-hidden="true">
                      <Icon size={18} />
                    </div>
                    {item.isPlaceholder && (
                      <Badge variant="neutral">Pending Setup</Badge>
                    )}
                  </div>
                  <h3 className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {item.label}
                  </h3>
                  <p className={`mt-1.5 text-xs leading-relaxed ${item.isPlaceholder ? 'italic text-slate-500' : 'text-slate-300'}`}>
                    {item.value}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}