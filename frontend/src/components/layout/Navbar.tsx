import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Activity, CalendarDays, MapPin, User, LogIn } from 'lucide-react';
import { Button } from '@/components/common';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Venue', path: '/venue', icon: MapPin },
    { label: 'Book Slot', path: '/booking', icon: CalendarDays },
    { label: 'My Bookings', path: '/my-bookings', icon: User },
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-2 text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-md px-2.5 py-1.5 ${
      isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  const getMobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
      isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg py-1 px-1.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-950/50">
            <Activity size={20} className="stroke-[2.5]" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Sport<span className="text-emerald-400">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className={getNavLinkClass}>
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" tabIndex={-1}>
            <Button variant="secondary" size="sm" leftIcon={<LogIn size={15} />}>
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
          >
            {isMobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 md:hidden">
          <nav className="space-y-1.5" aria-label="Mobile Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={getMobileNavLinkClass}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="pt-3">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                <Button variant="primary" size="md" className="w-full justify-center" leftIcon={<LogIn size={16} />}>
                  Login to Account
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}