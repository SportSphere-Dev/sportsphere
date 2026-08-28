import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { Button, Badge } from '@/components/common';
import { useAuth } from '@/context';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            to="/venue"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Venue</span>
          </Link>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber-400" />
            <span className="text-sm font-bold text-white">SportSphere Admin</span>
            <Badge variant="warning" className="text-[10px]">
              Host Access
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">{user?.name || 'Administrator'}</div>
            <div className="text-[10px] text-slate-500">{user?.email}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            leftIcon={<LogOut size={14} />}
            className="text-slate-400 hover:text-rose-400"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}