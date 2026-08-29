import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Zap, Sparkles } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Button, Badge } from '@/components/common';
import HeroVisual from './HeroVisual';
import heroBgImg from '@/assets/venue/1.jpg';

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25, filter: shouldReduceMotion ? 'none' : 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // cinematic cubic-bezier
      },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24 lg:py-28">
      {/* Deep Stadium Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden opacity-20">
        <img
          src={heroBgImg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center blur-lg scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
      </div>

      {/* Volumetric Radial Aura */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[140px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left: Staggered Hero Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:col-span-7 lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
              <Badge variant="brand" className="px-3 py-1 text-xs shadow-md shadow-emerald-950/50">
                <Sparkles size={13} className="mr-1.5 inline" aria-hidden="true" />
                SPORTS TURF BOOKING
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Direct Venue Access
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl uppercase"
            >
              Play more. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
                Book smarter.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed"
            >
              Check turf availability, choose your preferred slot, and secure your game directly without the back-and-forth of phone calls or manual coordination.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link to="/venue" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-xl shadow-emerald-500/25 transition-transform hover:scale-[1.02]"
                  rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  Check Availability
                </Button>
              </Link>
              <Link to="/venue" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto border-slate-700 bg-slate-900/80 hover:bg-slate-800"
                >
                  View Venue Details
                </Button>
              </Link>
            </motion.div>

            {/* Quick Guarantees */}
            <motion.div
              variants={itemVariants}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-left"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <ShieldCheck size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Zero Double-Booking</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Clock size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Up to 5 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Zap size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>5-Min Checkout Hold</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: 3D Interactive Hero Visual */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <HeroVisual />
          </motion.div>

        </div>
      </div>
    </section>
  );
}