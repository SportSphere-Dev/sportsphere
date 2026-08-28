import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/common';
import { PageTransition, FadeIn } from '@/components/motion';
import { useAuth } from '@/context';

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
    <PageTransition className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <FadeIn direction="up">
          <div className="text-center">
            <Badge variant="brand" className="px-3 py-1">
              <Sparkles size={13} className="mr-1.5 inline" />
              CREATE ACCOUNT
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Join SportSphere
            </h1>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Create an account to reserve turf match slots and manage bookings.
            </p>
          </div>

          <Card className="mt-8 border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
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
                  className="w-full justify-center shadow-lg shadow-emerald-500/20"
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
    </PageTransition>
  );
}