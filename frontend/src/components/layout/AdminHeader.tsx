import { Link } from 'react-router-dom';

export default function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 text-white">
      <h2 className="text-base font-semibold text-slate-200">Management Console</h2>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xs text-slate-400 hover:text-emerald-400">
          ← Exit to Venue
        </Link>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
          Admin
        </span>
      </div>
    </header>
  );
}