import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, Maximize2 } from 'lucide-react';
import { Badge } from '@/components/common';
import { FadeIn } from '@/components/motion';

import img1 from '@/assets/venue/1.jpg';
import img2 from '@/assets/venue/2.jpeg';
import img3 from '@/assets/venue/3.jpg';
import img4 from '@/assets/venue/4.jpg';
import img5 from '@/assets/venue/5.jpg';
import img6 from '@/assets/venue/6.jpeg';
import img7 from '@/assets/venue/7.jpeg';

const galleryItems = [
  { id: 'img-1', src: img1, title: 'Main Floodlit Arena', category: 'Aerial Arena' },
  { id: 'img-2', src: img2, title: 'Cricket Pitch Area', category: 'Cricket Track' },
  { id: 'img-3', src: img3, title: 'Netted Cricket Training Lanes', category: 'Practice Nets' },
  { id: 'img-4', src: img4, title: 'Football Match Surface', category: 'Match Session' },
  { id: 'img-5', src: img5, title: 'Enclosed Sports Court', category: 'Court Perimeter' },
  { id: 'img-6', src: img6, title: 'Multi-Sport Training Pitch', category: 'Practice Ground' },
  { id: 'img-7', src: img7, title: 'Full Striped Synthetic Turf', category: 'Wide Arena' },
];

export default function VenueGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentItem = galleryItems[activeIndex];

  return (
    <section className="border-b border-slate-800/80 bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="brand" className="text-[10px]">
                  <Camera size={12} className="mr-1 inline" />
                  VENUE GALLERY
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interactive Showcase
                </span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Experience the Facility
              </h2>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                Explore the synthetic match surface, cricket practice tracks, and arena facilities.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Select any view to expand preview</span>
            </div>
          </div>
        </FadeIn>

        {/* Featured Showcase Display */}
        <FadeIn direction="up" delay={0.1}>
          <div className="relative mt-8 aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentItem.id}
                src={currentItem.src}
                alt={currentItem.title}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="h-full w-full object-cover object-center"
              />
            </AnimatePresence>

            {/* Gradient Overlay & Metadata */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <Badge variant="brand" className="text-[10px] mb-2 px-2 py-0.5">
                  {currentItem.category}
                </Badge>
                <h3 className="text-xl md:text-3xl font-black text-white drop-shadow-lg tracking-tight">
                  {currentItem.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-950/70 px-3 py-1 rounded-full border border-slate-700/60 backdrop-blur-md">
                  <Maximize2 size={12} className="text-emerald-400" />
                  <span>0{activeIndex + 1} / 0{galleryItems.length}</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Interactive Thumbnail Strip */}
        <FadeIn direction="up" delay={0.15}>
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-7 gap-2.5 overflow-x-auto pb-2">
            {galleryItems.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`relative aspect-[16/10] overflow-hidden rounded-xl border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isActive
                      ? 'border-emerald-400 ring-2 ring-emerald-400/50 scale-[1.03] shadow-lg shadow-emerald-950/60'
                      : 'border-slate-800 opacity-50 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-400 rounded-xl" />
                  )}
                </button>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}