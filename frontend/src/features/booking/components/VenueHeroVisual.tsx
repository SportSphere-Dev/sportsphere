import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Shield, Users, Award, Sparkles } from 'lucide-react';
import { Badge } from '@/components/common';
import venueTurfImg from '@/assets/venue/7.jpeg';

export default function VenueHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto flex w-full max-w-lg items-center justify-center p-2 [perspective:1400px]"
    >
      {/* Stadium Ambient Floodlight */}
      <div
        className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[100px]"
        aria-hidden="true"
      />

      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/95 via-slate-950/90 to-slate-900/95 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-shadow duration-300 hover:border-emerald-500/40"
      >
        {/* Header */}
        <div
          style={{ transform: 'translateZ(25px)' }}
          className="flex items-center justify-between border-b border-slate-800/80 pb-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award size={16} aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
                Single Venue Facility
              </span>
              <div className="text-[10px] text-slate-500 font-mono">OFFICIAL MATCH TURF</div>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] tracking-wide uppercase px-2 py-0.5">
            Open for Booking
          </Badge>
        </div>

        {/* Photographic Turf Plane */}
        <div
          style={{ transform: 'translateZ(10px)' }}
          className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950 shadow-inner group"
        >
          <img
            src={venueTurfImg}
            alt="Full-sized sports arena turf with natural backdrop"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />

          {/* Floating Card: Capacity (Spatial Depth +45px) */}
          <motion.div
            style={{ transform: 'translateZ(45px)' }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-3 left-3 right-3 flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-900/90 p-2.5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                <Users size={15} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Full-Sized Synthetic Turf</div>
                <div className="text-[10px] text-slate-400">Standard match capacity: Up to 15 players</div>
              </div>
            </div>
            <Badge variant="brand" className="text-[10px] px-2">
              Verified
            </Badge>
          </motion.div>
        </div>

        {/* Footer Badges */}
        <div
          style={{ transform: 'translateZ(20px)' }}
          className="mt-3.5 flex items-center justify-between px-1 text-[11px] text-slate-400"
        >
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-emerald-400" />
            <span>High-Density Synthetic Turf</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            <span>Max 5-Hour Sessions</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}