import { Maximize2, Users, Layers, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/common';
import { FadeIn } from '@/components/motion';

export default function VenueDiagram() {
  return (
    <section className="border-b border-slate-800/80 bg-slate-900/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pitch Specifications</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Arena Architecture
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Visual layout representation of the single sports turf arena.
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.15}>
          <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Visual Pitch Schematic */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-950 via-emerald-950/20 to-slate-950 p-6 shadow-2xl">
                {/* Field Geometry */}
                <div className="relative h-full w-full rounded-xl border-2 border-emerald-400/30 p-2">
                  <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-emerald-400/30" />
                  <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400/30" />
                  <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/60" />

                  {/* Penalty / Goal Boxes */}
                  <div className="absolute top-0 left-1/2 h-10 w-32 -translate-x-1/2 rounded-b-lg border-x-2 border-b-2 border-emerald-400/30" />
                  <div className="absolute bottom-0 left-1/2 h-10 w-32 -translate-x-1/2 rounded-t-lg border-x-2 border-t-2 border-emerald-400/30" />

                  {/* Corner Arcs */}
                  <div className="absolute top-0 left-0 h-4 w-4 rounded-br-full border-r-2 border-b-2 border-emerald-400/30" />
                  <div className="absolute top-0 right-0 h-4 w-4 rounded-bl-full border-l-2 border-b-2 border-emerald-400/30" />
                  <div className="absolute bottom-0 left-0 h-4 w-4 rounded-tr-full border-r-2 border-t-2 border-emerald-400/30" />
                  <div className="absolute bottom-0 right-0 h-4 w-4 rounded-tl-full border-l-2 border-t-2 border-emerald-400/30" />

                  <div className="absolute bottom-3 left-4 text-[10px] font-mono tracking-wider text-emerald-400/60">
                    SINGLE ARENA // PRIMARY TURF
                  </div>
                </div>
              </div>
            </div>

            {/* Schematic Details */}
            <div className="space-y-4 lg:col-span-5">
              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Maximize2 size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Full-Sized Turf Arena</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      High-density synthetic turf designed for optimal shock absorption, traction, and ball bounce.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">15-Player Baseline</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Standard capacity accommodates up to 15 players. Additional players can be accommodated at the centre.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Layers size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Multi-Format Match Ready</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Engineered for football, box cricket, and continuous tournament training sessions.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Verified Maintenance</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      Slots can be reserved for maintenance up to 2 days in advance to ensure premier turf quality.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}