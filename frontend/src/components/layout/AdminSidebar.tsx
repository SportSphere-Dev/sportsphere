import { Link } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 text-white flex flex-col justify-between">
      <div className="space-y-6">
        <div className="px-2">
          <Link to="/admin" className="text-lg font-bold tracking-wider text-emerald-400">
            SPORTSPHERE
          </Link>
          <p className="text-xs text-slate-500">Admin Workspace</p>
        </div>
        <nav className="space-y-1 text-sm text-slate-300">
          <Link to="/admin" className="block rounded-md bg-slate-900 px-3 py-2 font-medium text-white">
            Dashboard
          </Link>
        </nav>
      </div>
    </aside>
  );
}