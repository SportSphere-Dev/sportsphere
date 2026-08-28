import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { Button } from '@/components/common';
import { FadeIn } from '@/components/motion';

export default function VenueFinalCta() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-14 shadow-2xl shadow-black/80">
            <div className="inline-flex rounded-full bg-emerald-500/10 p-3 text-emerald-400">
              <Trophy size={28} />
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready for your next match?
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
              Check live schedules across the 5-day window and reserve your slot instantly.
            </p>

            <div className="mt-8 flex justify-center">
              <Link to="/booking">
                <Button
                  size="lg"
                  className="shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  View Available Slots
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}