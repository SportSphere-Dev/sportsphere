import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Info,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/common';
import { PageTransition, FadeIn } from '@/components/motion';
import { useAuth } from '@/context';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <PageTransition className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Page Header */}
        <FadeIn direction="up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <Badge variant="brand" className="text-[10px] px-2.5 py-0.5">
                  <Activity size={12} className="mr-1 inline" />
                  ACCOUNT OVERVIEW
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Customer Profile
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Profile & Settings
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                View your verified account credentials and active platform permissions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/my-bookings">
                <Button variant="secondary" size="md" className="border-slate-800 bg-slate-900" rightIcon={<ArrowRight size={15} />}>
                  My Bookings
                </Button>
              </Link>
              <Button
                variant="danger"
                size="md"
                onClick={logout}
                leftIcon={<LogOut size={15} />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Profile Card & Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Avatar & Summary (Col 5) */}
          <div className="md:col-span-5">
            <FadeIn direction="up" delay={0.05}>
              <Card className="p-6 border-slate-800 bg-slate-900/80 text-center space-y-4 shadow-xl">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
                  <UserIcon size={40} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white">{user.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-center gap-2">
                  <Badge variant={user.role === 'admin' ? 'warning' : 'brand'} className="text-xs uppercase px-2.5 py-0.5">
                    {user.role} Account
                  </Badge>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  ACCOUNT REF #{user.id}
                </div>
              </Card>
            </FadeIn>
          </div>

          {/* Right Column: Account Specifications (Col 7) */}
          <div className="md:col-span-7 space-y-4">
            <FadeIn direction="up" delay={0.1}>
              <Card className="p-6 border-slate-800 bg-slate-900/80 shadow-xl space-y-5">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                  Account Credentials
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/70">
                    <div className="flex items-center gap-2.5 text-slate-400">
                      <UserIcon size={15} className="text-emerald-400" />
                      <span>Full Name</span>
                    </div>
                    <span className="font-semibold text-white">{user.name}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/70">
                    <div className="flex items-center gap-2.5 text-slate-400">
                      <Mail size={15} className="text-emerald-400" />
                      <span>Email Address</span>
                    </div>
                    <span className="font-semibold text-white font-mono">{user.email}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/70">
                    <div className="flex items-center gap-2.5 text-slate-400">
                      <Shield size={15} className="text-emerald-400" />
                      <span>Access Role</span>
                    </div>
                    <span className="font-semibold text-white uppercase font-mono">{user.role}</span>
                  </div>
                </div>

                {/* Profile Edit Limitation Callout */}
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-400">
                  <Info size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    Profile editing is currently restricted. Account email and name changes will be supported when update endpoints are deployed.
                  </span>
                </div>
              </Card>
            </FadeIn>

            {/* Quick Navigation Card */}
            <FadeIn direction="up" delay={0.15}>
              <Card className="p-4 border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Court Schedule & Bookings</div>
                    <div className="text-[11px] text-slate-500">Manage active holds and match confirmations</div>
                  </div>
                </div>

                <Link to="/booking">
                  <Button size="sm" variant="secondary" className="border-slate-700 bg-slate-800 text-xs">
                    Book Turf
                  </Button>
                </Link>
              </Card>
            </FadeIn>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}