import { Link } from 'react-router-dom';
import { ArrowRight, Trees, ShieldCheck, Flame, Compass } from 'lucide-react';
import { Button, Badge } from '@/components/common';
import { FadeIn } from '@/components/motion';
import forestTurfImg from '@/assets/venue/8.jpeg';

export default function VenueImmersiveSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-20 sm:py-28">
      {/* Full-width Panoramic Layer */}
      <div className="absolute inset-0 -z-10">
        <img
          src={forestTurfImg}
          alt="Aerial view of the synthetic sports turf arena surrounded by nature"
          className="h-full w-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-2">
              <Badge variant="brand" className="text-[10px]">
                <Trees size={12} className="mr-1 inline" />
                IMMERSIVE ENVIRONMENT
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Natural Backdrop
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl uppercase">
              Experience the Game Differently
            </h2>

            <p className="mt-4 text-sm text-slate-300 sm:text-base leading-relaxed">
              Step onto an arena engineered for competitive team play, surrounded by tranquil natural greenery. Unmatched footing, high-performance synthetic turf, and seamless online scheduling.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <ShieldCheck size={16} />
                  <span>Cushioned Synthetic Turf</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">High shock absorption minimizing joint fatigue</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Flame size={16} />
                  <span>Flexible Match Blocks</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Reserve consecutive sessions up to 5 hours</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-emerald-500/25" rightIcon={<ArrowRight size={18} />}>
                  Check Live Availability
                </Button>
              </Link>
              <a href="#facility-showcase" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto border-slate-700 bg-slate-900/80" leftIcon={<Compass size={16} />}>
                  Explore Facility
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}