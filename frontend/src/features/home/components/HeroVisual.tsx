import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Shield, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/common';

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Pointer position coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D tilt
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
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
      className="relative mx-auto flex w-full max-w-lg items-center justify-center p-4 [perspective:1200px]"
    >
      {/* Stadium Ambient Floodlight */}
      <div 
        className="pointer-events-none absolute -top-12 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[90px]"
        aria-hidden="true"
      />

      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full rounded-3xl border border-slate-700/60 bg-gradient-to-b from-slate-900/90 via-slate-950/90 to-slate-900/90 p-6 shadow-2xl shadow-black/80 backdrop-blur-md"
      >
        {/* Arena Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
              Match Pitch Arena
            </span>
          </div>
          <Badge variant="success" className="text-[10px] tracking-wide uppercase">
            Live Feed
          </Badge>
        </div>

        {/* 3D Turf Plane Canvas Container */}
        <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/50 via-slate-950 to-slate-950 p-4 shadow-inner">
          
          {/* Turf Pitch Markings & Field Lines */}
          <div className="absolute inset-2 rounded-xl border border-emerald-400/20" />
          <div className="absolute top-1/2 left-2 right-2 h-px -translate-y-1/2 bg-emerald-400/20" />
          <div className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20" />
          <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/40" />
          
          {/* Goal Box Top & Bottom */}
          <div className="absolute top-2 left-1/2 h-7 w-24 -translate-x-1/2 rounded-b-md border-x border-b border-emerald-400/20" />
          <div className="absolute bottom-2 left-1/2 h-7 w-24 -translate-x-1/2 rounded-t-md border-x border-t border-emerald-400/20" />

          {/* Floating Live Slot Card 1 */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-4 left-4 right-4 flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                <Clock size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">06:00 PM — 08:00 PM</div>
                <div className="text-[10px] text-slate-400">2-Hour Prime Session</div>
              </div>
            </div>
            <Badge variant="brand" className="text-[10px]">
              Ready to Lock
            </Badge>
          </motion.div>

          {/* Floating Live Status Card 2 */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/90 p-3 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-slate-800 p-1.5 text-emerald-400">
                <CheckCircle2 size={16} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Instant Verification</div>
                <div className="text-[10px] text-slate-500">5-Min Checkout Hold Active</div>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400">100% Reserved</span>
          </motion.div>
        </div>

        {/* Footer Guarantee Badges */}
        <div className="mt-4 flex items-center justify-between px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Shield size={13} className="text-emerald-400" />
            <span>Multi-Format synthetic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            <span>Floodlights & Gear</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}