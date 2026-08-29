import { Link } from 'react-router-dom';
import { ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { Card, Button, Badge } from '@/components/common';
import { PageTransition, FadeIn } from '@/components/motion';

export default function VerifyOtpPage() {
  return (
    <PageTransition className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <FadeIn direction="up">
          <div className="text-center">
            <Badge variant="neutral" className="px-3 py-1">
              SECURITY STATUS
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Account Verification
            </h1>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Two-factor OTP phone and email verification status.
            </p>
          </div>

          <Card className="mt-8 border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <h2 className="mt-4 text-base font-semibold text-white">Direct Access Enabled</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                OTP verification endpoints are currently under backend development. Direct email and password authentication is active.
              </p>
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-400">
              <Info size={16} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>You can proceed directly to your account using your registered credentials.</span>
            </div>

            <div className="mt-6">
              <Link to="/login" className="block w-full">
                <Button size="md" variant="secondary" className="w-full justify-center" leftIcon={<ArrowLeft size={16} />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </Card>
        </FadeIn>
      </div>
    </PageTransition>
  );
}