import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand + Purpose */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link
              to="/"
              className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md py-0.5 px-1"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-emerald-500 text-slate-950">
                <Activity size={16} className="stroke-[2.5]" aria-hidden="true" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Sport<span className="text-emerald-400">Sphere</span>
              </span>
            </Link>
            <p className="mt-2 max-w-xs text-xs text-slate-500">
              A smarter way to book your sports turf.
            </p>
          </div>

          {/* Internal Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400"
          >
            <Link
              to="/venue"
              className="transition-colors hover:text-emerald-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
            >
              Venue Details
            </Link>
            <Link
              to="/booking"
              className="transition-colors hover:text-emerald-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
            >
              Book Slot
            </Link>
            <Link
              to="/my-bookings"
              className="transition-colors hover:text-emerald-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
            >
              My Bookings
            </Link>
            <Link
              to="/login"
              className="transition-colors hover:text-emerald-400 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
            >
              Customer Login
            </Link>
          </nav>
        </div>

        {/* Copyright & Subtext */}
        <div className="mt-8 border-t border-slate-900 pt-6 text-center text-xs text-slate-600">
          <p>© {currentYear} SportSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}