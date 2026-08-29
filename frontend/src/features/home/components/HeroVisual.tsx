import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Shield, Sparkles, Clock, CheckCircle2, Zap } from 'lucide-react';
import { Badge } from '@/components/common';
import heroTurfImg from '@/assets/venue/1.jpg';

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Responsive spring physics
  const springConfig = { damping: 20, stiffness: 100, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), springConfig);
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), springConfig);

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
      {/* Dynamic Ambient Stadium Floodlight */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px] transition-opacity duration-500"
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
        {/* Pointer-driven Dynamic Glare Layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-20 mix-blend-overlay transition-opacity"
          style={{
            background: shouldReduceMotion
              ? 'none'
              : `radial-gradient(circle at ${glareX}\%${glareY}%, rgba(52,211,153,0.8), transparent 60%)`,
          }}
          aria-hidden="true"
        />

        {/* Stadium Arena Header */}
        <div
          style={{ transform: 'translateZ(25px)' }}
          className="flex items-center justify-between border-b border-slate-800/80 pb-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
                Match Pitch Arena
              </span>
              <div className="text-[10px] text-slate-500 font-mono">LIVE COURT SCHEDULE</div>
            </div>
          </div>
          <Badge variant="brand" className="text-[10px] tracking-wide uppercase px-2 py-0.5">
            <Zap size={10} className="mr-1 inline" /> Arena Active
          </Badge>
        </div>

        {/* 3D Photographic Field Layer */}
        <div
          style={{ transform: 'translateZ(10px)' }}
          className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950 shadow-inner group"
        >
          <img
            src={heroTurfImg}
            alt="Aerial perspective of floodlit multi-format sports arena turf"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          {/* Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-radial-vignette opacity-40" />

          {/* Floating Live Slot Card (Foreground Plane +45px) */}
          <motion.div
            style={{ transform: 'translateZ(45px)' }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-3 left-3 right-3 flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-900/90 p-2.5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                <Clock size={15} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">06:00 PM — 08:00 PM</div>
                <div className="text-[10px] text-slate-400">2-Hour Prime Evening Session</div>
              </div>
            </div>
            <Badge variant="brand" className="text-[10px] px-2">
              Hold Ready
            </Badge>
          </motion.div>

          {/* Floating Verification Card (Foreground Plane +55px) */}
          <motion.div
            style={{ transform: 'translateZ(55px)' }}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/90 p-2.5 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-950/60 border border-emerald-500/30 p-1.5 text-emerald-400">
                <CheckCircle2 size={15} aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Zero Double-Booking</div>
                <div className="text-[10px] text-slate-500">5-Min Checkout Hold Active</div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">AVAILABLE</span>
          </motion.div>
        </div>

        {/* Footer Guarantee Badges */}
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
            <span>Floodlights & Training Gear</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}