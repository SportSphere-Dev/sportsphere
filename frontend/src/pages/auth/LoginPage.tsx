import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LogIn, AlertCircle, ShieldCheck, Sparkles, Activity, Clock, Users } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/common';
import { PageTransition, FadeIn } from '@/components/motion';
import { useAuth } from '@/context';
import authTurfImg from '@/assets/venue/1.jpg';

interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const state = location.state as LocationState;
  const redirectPath = state?.from?.pathname;
  const successMessage = state?.message;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const authenticatedUser = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (authenticatedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else {
        navigate('/venue', { replace: true });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else if (err.response?.status === 422) {
          setErrorMessage('Please check the entered email and password format.');
        } else if (!err.response) {
          setErrorMessage('Unable to connect to the server. Please check your connection.');
        } else {
          setErrorMessage('An error occurred during login. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Stadium Ambient Background Aura */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[140px]"
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Cinematic Visual Showcase Panel */}
          <div className="hidden lg:block lg:col-span-6">
            <FadeIn direction="up">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src={authTurfImg}
                  alt="SportSphere Floodlit Turf Arena"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1.5 border border-slate-700/60 backdrop-blur-md">
                    <Activity size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">SportSphere Turf</span>
                  </div>
                  <Badge variant="brand" className="text-[10px]">
                    Single Venue
                  </Badge>
                </div>

                {/* Floating Bottom Live Guarantee Card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-slate-700/70 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-emerald-400" />
                      <span className="font-semibold text-white">Live Slot Synchronization</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">ACTIVE</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users size={12} className="text-emerald-400" /> Max 15 Players Included
                    </span>
                    <span>5-Min Checkout Hold</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: Authentication Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center lg:text-left">
                <Badge variant="brand" className="px-3 py-1 shadow-lg shadow-emerald-950/50">
                  <Sparkles size={12} className="mr-1 inline" />
                  SPORTSPHERE ACCESS
                </Badge>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl uppercase">
                  Welcome back
                </h1>
                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  Sign in to manage your bookings and reserve your match session.
                </p>
              </div>

              <Card className="mt-6 border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                {successMessage && (
                  <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-3 text-xs text-emerald-400">
                    <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div
                    role="alert"
                    className="mb-6 flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-950/30 p-3 text-xs text-rose-400"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    disabled={isLoading}
                  />

                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={fieldErrors.password}
                    disabled={isLoading}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full justify-center shadow-xl shadow-emerald-500/25"
                      isLoading={isLoading}
                      leftIcon={!isLoading && <LogIn size={16} />}
                    >
                      Sign In
                    </Button>
                  </div>
                </form>

                <div className="mt-6 border-t border-slate-800 pt-5 text-center text-xs text-slate-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-emerald-400 hover:text-emerald-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
                  >
                    Register here
                  </Link>
                </div>
              </Card>
            </FadeIn>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}