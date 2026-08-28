import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Clock, CalendarRange } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Button, Badge } from '@/components/common';
import VenueHeroVisual from './VenueHeroVisual';

export default function VenueHero() {
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950 py-16 sm:py-20 lg:py-28">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Venue Details */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:col-span-7 lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2">
              <Badge variant="brand" className="px-2.5 py-1 text-xs">
                <Sparkles size={13} className="mr-1.5 inline" aria-hidden="true" />
                PREMIER TURF
              </Badge>
              <span className="text-xs font-semibold text-slate-400">Single Venue Facility</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Your game <br />
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                starts here.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-2xl text-base text-slate-300 sm:text-lg"
            >
              A dedicated sports arena configured for multi-format matches, team practice, and competitive games. Check live slot schedules, select your duration, and lock your session without double bookings.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link to="/booking" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto shadow-lg shadow-emerald-500/20"
                  rightIcon={<ArrowRight size={18} aria-hidden="true" />}
                >
                  View Available Slots
                </Button>
              </Link>
              <a href="#facility-showcase" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Facility
                </Button>
              </a>
            </motion.div>

            {/* Quick Guarantees */}
            <motion.div
              variants={itemVariants}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-left"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <CalendarRange size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>5-Day Booking Window</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Clock size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Up to 5 Hours</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <ShieldCheck size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Zero Double Booking</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Interactive Visual */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <VenueHeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}