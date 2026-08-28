import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LogIn, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/common';
import { PageTransition, FadeIn } from '@/components/motion';
import { useAuth } from '@/context';

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
    <PageTransition className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <FadeIn direction="up">
          <div className="text-center">
            <Badge variant="brand" className="px-3 py-1">
              SPORTSPHERE AUTH
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Sign in to manage your bookings and secure your turf slots.
            </p>
          </div>

          <Card className="mt-8 border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
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
                  className="w-full justify-center shadow-lg shadow-emerald-500/20"
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
    </PageTransition>
  );
}