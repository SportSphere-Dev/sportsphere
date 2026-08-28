import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900 px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-emerald-400">
          SportSphere
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link to="/venue" className="hover:text-white">Venue</Link>
          <Link to="/booking" className="hover:text-white">Book Slot</Link>
          <Link to="/my-bookings" className="hover:text-white">My Bookings</Link>
          <Link to="/login" className="hover:text-white">Login</Link>
          <Link to="/admin" className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700">
            Admin Panel
          </Link>
        </nav>
      </div>
    </header>
  );
}