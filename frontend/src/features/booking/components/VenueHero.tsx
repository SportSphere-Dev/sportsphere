import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button, Badge } from '@/components/common';

export default function VenueHero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-12 sm:py-16 lg:py-20">
      {/* Background Ambient Glow */}
      <div 
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[100px]" 
        aria-hidden="true" 
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Venue Intro */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="brand">PREMIER TURF</Badge>
              <span className="text-xs font-medium text-slate-400">Single Venue Facility</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Sports Turf Venue
            </h1>

            <p className="mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
              A dedicated sports arena configured for multi-format matches, team practice, and competitive games. Check live slot schedules and reserve your session directly.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link to="/booking" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  View Available Slots
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Venue Card Visual Placeholder */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto flex aspect-video w-full max-w-md flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-xl shadow-black/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Match Ready</span>
                </div>
                <Badge variant="success">Open for Booking</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin size={14} className="text-emerald-400" aria-hidden="true" />
                  <span>Main Sports Arena</span>
                </div>
                <div className="text-base font-bold text-white">Full-Sized Synthetic Turf</div>
                <p className="text-xs text-slate-500">Standard player capacity: Up to 15 players</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}