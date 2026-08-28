import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Button, Badge } from '@/components/common';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24 lg:py-32">
      {/* Background Ambient Glow */}
      <div 
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-[120px]" 
        aria-hidden="true" 
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Messaging */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <div className="inline-flex items-center gap-2">
              <Badge variant="brand">SPORTS TURF BOOKING</Badge>
              <span className="text-xs font-medium text-slate-400">Direct Venue Access</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Play more. <br />
              <span className="text-emerald-400">Book smarter.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
              Check turf availability, choose your preferred slot, and secure your game directly without the hassle of phone calls or manual coordination.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link to="/venue" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto" 
                  rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Check Availability
                </Button>
              </Link>
              <Link to="/venue" className="w-full sm:w-auto">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full sm:w-auto"
                >
                  View Venue Details
                </Button>
              </Link>
            </div>

            {/* Quick Guarantees */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <ShieldCheck size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Zero Double Booking</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Clock size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Up to 5 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Zap size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>5-Min Checkout Hold</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Preview Treatment */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-black/60 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Turf Match Schedule</span>
                </div>
                <Badge variant="neutral">Live Preview</Badge>
              </div>

              {/* Mock Visual Slots */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-emerald-400" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-white">06:00 PM - 07:00 PM</div>
                      <div className="text-[10px] text-slate-400">Prime Evening Slot</div>
                    </div>
                  </div>
                  <Badge variant="success">Available</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/30 p-3 opacity-60">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-500" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-slate-300">07:00 PM - 08:00 PM</div>
                      <div className="text-[10px] text-slate-500">Reserved</div>
                    </div>
                  </div>
                  <Badge variant="neutral">Booked</Badge>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-950/20 p-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-emerald-400" aria-hidden="true" />
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">08:00 PM - 09:00 PM</div>
                      <div className="text-[10px] text-emerald-400/80">Selected by you</div>
                    </div>
                  </div>
                  <Badge variant="brand">Selected</Badge>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-slate-800/80 bg-slate-950/80 p-3 text-center text-xs text-slate-400">
                Online booking window opens 5 days in advance.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}