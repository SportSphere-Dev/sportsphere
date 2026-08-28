import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/common';

export default function FinalCta() {
  return (
    <section className="bg-slate-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-xl shadow-black/40">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to book your game?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
            Check the live venue schedule, pick your preferred hours, and reserve your turf slot immediately.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/venue">
              <Button size="lg" rightIcon={<ArrowRight size={18} aria-hidden="true" />}>
                Check Availability
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}