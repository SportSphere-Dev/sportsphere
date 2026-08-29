import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, AlertCircle, Sparkles, Activity, Trophy } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/common';
import { PageTransition, FadeIn } from '@/components/motion';
import { useAuth } from '@/context';
import registerTurfImg from '@/assets/venue/4.jpg';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setErrorMessage(null);
  };

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate('/login', {
        state: { message: 'Account created successfully. Please sign in.' },
        replace: true,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setErrorMessage('An account with this email already exists.');
        } else if (err.response?.status === 422) {
          setErrorMessage('Please check the entered information format.');
        } else if (!err.response) {
          setErrorMessage('Unable to connect to the server. Please check your connection.');
        } else {
          setErrorMessage('An error occurred during registration. Please try again.');
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
      {/* Stadium Ambient Aura */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[140px]"
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Action Visual Showcase */}
          <div className="hidden lg:block lg:col-span-6">
            <FadeIn direction="up">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                <img
                  src={registerTurfImg}
                  alt="Players in match play on synthetic turf"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1.5 border border-slate-700/60 backdrop-blur-md">
                    <Activity size={14} className="text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Join the Community</span>
                  </div>
                  <Badge variant="brand" className="text-[10px]">
                    Instant Access
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-slate-700/70 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Trophy size={15} className="text-emerald-400" />
                    <span>Your Match Starts with a Slot</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                    Direct access to schedule verification, custom match durations, and gear reservations.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: Registration Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <FadeIn direction="up" delay={0.1}>
              <div className="text-center lg:text-left">
                <Badge variant="brand" className="px-3 py-1 shadow-lg shadow-emerald-950/50">
                  <Sparkles size={12} className="mr-1 inline" />
                  CREATE ACCOUNT
                </Badge>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl uppercase">
                  Join SportSphere
                </h1>
                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  Create an account to reserve turf match slots and manage bookings.
                </p>
              </div>

              <Card className="mt-6 border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
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
                    label="Full Name"
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    error={fieldErrors.name}
                    disabled={isLoading}
                  />

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
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={fieldErrors.password}
                    disabled={isLoading}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={fieldErrors.confirmPassword}
                    disabled={isLoading}
                  />

                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full justify-center shadow-xl shadow-emerald-500/25"
                      isLoading={isLoading}
                      leftIcon={!isLoading && <UserPlus size={16} />}
                    >
                      Create Account
                    </Button>
                  </div>
                </form>

                <div className="mt-6 border-t border-slate-800 pt-5 text-center text-xs text-slate-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-emerald-400 hover:text-emerald-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-sm"
                  >
                    Sign in
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