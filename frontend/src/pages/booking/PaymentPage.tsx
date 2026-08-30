import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
declare global {
  interface Window {
    Razorpay: any;
  }
}
import {
  ShieldAlert,
  Clock,
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/common';
import { LoadingSpinner } from '@/components/feedback';
import { PageTransition, FadeIn } from '@/components/motion';
import { createPayment, verifyPayment } from '@/features/booking/api';
import type { BackendBookingResponse, BackendPaymentResponse, Slot } from '@/types';

interface PaymentLocationState {
  booking?: BackendBookingResponse;
  slot?: Slot;
  date?: string;
}

export default function PaymentPage() {
  const location = useLocation();
  const state = location.state as PaymentLocationState | undefined;

  const booking = state?.booking;
  const slot = state?.slot;
  const matchDate = state?.date;

  const [payment, setPayment] = useState<BackendPaymentResponse | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState<boolean>(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  // Prevent duplicate creation requests across re-renders
  const hasInitializedPayment = useRef(false);

  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number; isExpired: boolean }>({
    minutes: 5,
    seconds: 0,
    isExpired: false,
  });

  // Calculate remaining hold time from backend hold_expires_at timestamp
  useEffect(() => {
    if (!booking?.hold_expires_at || isConfirmed) return;

    const calculateRemaining = () => {
      const expiresTime = new Date(booking.hold_expires_at!).getTime();
      const now = Date.now();
      const diffMs = expiresTime - now;

      if (diffMs <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      setTimeLeft({ minutes, seconds, isExpired: false });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [booking?.hold_expires_at, isConfirmed]);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // Initialize Payment session via POST /payments/
  const initPayment = async () => {
    if (!booking?.id) return;
    setIsInitializingPayment(true);
    setPaymentError(null);

    try {
      const paymentRecord = await createPayment({ booking_id: booking.id });
      setPayment(paymentRecord);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const detail = err.response?.data?.detail;

        if (status === 401) {
          setPaymentError('Authentication required. Please sign in again.');
        } else if (status === 404) {
          setPaymentError('The booking was not found or has expired.');
        } else if (status === 409) {
          setPaymentError(
            typeof detail === 'string'
              ? detail
              : 'Booking is no longer available for payment or payment was already created.'
          );
        } else if (status === 422) {
          setPaymentError('Invalid payment request parameters.');
        } else if (!err.response) {
          setPaymentError('Unable to connect to the payment service. Please try again.');
        } else {
          setPaymentError('Failed to initialize payment session. Please retry.');
        }
      } else {
        setPaymentError('An unexpected error occurred while setting up payment.');
      }
    } finally {
      setIsInitializingPayment(false);
    }
  };

  useEffect(() => {
    if (booking?.id && !hasInitializedPayment.current) {
      hasInitializedPayment.current = true;
      initPayment();
    }
  }, [booking?.id]);

  // Open Razorpay Checkout and verify the payment via POST /payments/verify
  const handlePayment = async () => {
  if (!booking || !payment || isVerifyingPayment || timeLeft.isExpired) return;

  setIsVerifyingPayment(true);
  setPaymentError(null);

  try {
    const razorpayLoaded = await loadRazorpay();

    if (!razorpayLoaded) {
      setPaymentError(
        'Unable to load Razorpay Checkout. Please check your internet connection and try again.'
      );
      return;
    }

    if (!payment.razorpay_key_id || !payment.razorpay_order_id) {
      setPaymentError('Payment order information is missing.');
      return;
    }

    const options = {
      key: payment.razorpay_key_id,
      amount: payment.amount * 100,
      currency: 'INR',
      name: 'SportSphere',
      description: `Booking #${booking.id}`,
      order_id: payment.razorpay_order_id,

      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verifiedRecord = await verifyPayment({
            payment_id: payment.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          setPayment(verifiedRecord);
          setIsConfirmed(true);
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const detail = err.response?.data?.detail;

            setPaymentError(
              typeof detail === 'string'
                ? detail
                : 'Payment verification failed. Please contact support if money was deducted.'
            );
          } else {
            setPaymentError(
              'Payment verification failed. Please contact support if money was deducted.'
            );
          }
        } finally {
          setIsVerifyingPayment(false);
        }
      },

      modal: {
        ondismiss: () => {
          setIsVerifyingPayment(false);
        },
      },

      theme: {
        color: '#10b981',
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on(
      'payment.failed',
      (response: {
        error?: {
          description?: string;
        };
      }) => {
        setPaymentError(
          response.error?.description ||
            'Payment failed. Please try again.'
        );
        setIsVerifyingPayment(false);
      }
    );

    razorpay.open();
  } catch {
    setPaymentError('Unable to start the payment process.');
    setIsVerifyingPayment(false);
  }
};

  const formatTimerDigits = (val: number) => val.toString().padStart(2, '0');

  // Booking is required for this page
  if (!booking) {
    return (
      <PageTransition className="min-h-screen bg-slate-950 py-12 px-4 flex items-center justify-center">
        <Card className="p-8 border-slate-800 bg-slate-900 text-center">
          <h1 className="text-xl font-bold text-white">
            Booking not found
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Please return to the booking page and select a slot again.
          </p>
          <Link to="/booking" className="inline-block mt-6">
            <Button>
              Back to Booking
            </Button>
          </Link>
        </Card>
      </PageTransition>
    );
  }

  // Confirmation Success View
  if (isConfirmed) {
    return (
      <PageTransition className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeIn direction="up">
            <Card className="p-6 sm:p-10 border-emerald-500/40 bg-slate-900/95 shadow-2xl text-center space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-8 ring-emerald-500/10">
                <CheckCircle size={36} />
              </div>

              <div>
                <Badge variant="success">
                  Payment Successful
                </Badge>
                <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Booking Confirmed
                </h1>
                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  Your court reservation has been confirmed by the booking engine.
                </p>
              </div>

              {/* Receipt Breakdown Console */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Booking Reference</span>
                  <span className="font-mono font-bold text-white">#{booking.id}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Payment Reference</span>
                  <span className="font-mono font-bold text-white">#{payment?.id}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Match Date</span>
                  <span className="font-semibold text-white">{matchDate || 'Confirmed Date'}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Match Slot</span>
                  <span className="font-semibold text-white">{slot?.time || `Slot #${booking.slot_id}`}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Players</span>
                  <span className="font-semibold text-white">{booking.number_of_players} players</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-slate-400">Payment Status</span>
                  <span className="font-mono font-bold text-emerald-400 uppercase">
                    {payment?.status || 'success'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-sm font-bold">
                  <span className="text-slate-300">Amount Settled</span>
                  <span className="text-emerald-400 font-mono text-base">
                    ₹{(payment?.amount ?? booking.total_price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Next Action Links */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/my-bookings" className="flex-1">
                  <Button size="lg" className="w-full justify-center shadow-xl shadow-emerald-500/20">
                    View My Bookings
                  </Button>
                </Link>
                <Link to="/venue" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full justify-center border-slate-700 bg-slate-900/80">
                    Back to Venue
                  </Button>
                </Link>
              </div>
            </Card>
          </FadeIn>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <FadeIn direction="up">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={timeLeft.isExpired ? 'error' : 'warning'} className="text-xs">
                  {timeLeft.isExpired ? 'Hold Expired' : 'Slot Held for 5 Minutes'}
                </Badge>
                <span className="text-xs font-mono text-slate-400">BOOKING #{booking.id}</span>
              </div>
              <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl uppercase tracking-tight">
                Secure Your Match Slot
              </h1>
            </div>
            <Link to="/booking" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Booking
            </Link>
          </div>

          {/* Error Banner */}
          {paymentError && (
            <div
              role="alert"
              className="mt-6 flex items-start justify-between gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-300"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
                <span>{paymentError}</span>
              </div>
              {!payment && (
                <button
                  type="button"
                  onClick={initPayment}
                  className="flex items-center gap-1 font-semibold text-rose-300 hover:text-white underline underline-offset-2 ml-2 shrink-0"
                >
                  <RotateCcw size={13} /> Retry
                </button>
              )}
            </div>
          )}

          {/* 5-Minute Hold Countdown Banner */}
          <Card
            className={`mt-6 p-4 border transition-all ${
              timeLeft.isExpired
                ? 'border-rose-500/40 bg-rose-950/30'
                : 'border-amber-500/40 bg-amber-950/20'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div
                  className={`rounded-xl p-2.5 ${
                    timeLeft.isExpired
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {timeLeft.isExpired ? 'Checkout Time Expired' : 'Temporary Reservation Active'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {timeLeft.isExpired
                      ? 'Your 5-minute hold has elapsed. Please return to schedule if slot is unavailable.'
                      : 'Complete your payment verification before the timer elapses to confirm your match.'}
                  </p>
                </div>
              </div>

              {/* Timer Output */}
              <div
                className={`font-mono text-xl font-black px-4 py-1.5 rounded-xl border ${
                  timeLeft.isExpired
                    ? 'border-rose-500/50 bg-rose-900/40 text-rose-300'
                    : 'border-amber-500/50 bg-amber-900/40 text-amber-300'
                }`}
              >
                {formatTimerDigits(timeLeft.minutes)}:{formatTimerDigits(timeLeft.seconds)}
              </div>
            </div>
          </Card>

          {/* Simulation Notice Card */}
          <Card className="mt-6 p-4 border-slate-800 bg-slate-900/60 flex items-start gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400 shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-white">
                Secure Razorpay Payment:
              </span>{' '}
              Complete your payment through Razorpay to confirm your booking.
            </div>
          </Card>

          {/* Booking Summary Console */}
          <Card className="mt-6 p-6 sm:p-8 border-slate-800 bg-slate-900/90 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Reservation Breakdown</h2>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Status: {booking.status}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/70">
                <Calendar size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400">Match Date</span>
                  <div className="font-semibold text-white">{matchDate || 'Confirmed Date'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/70">
                <Clock size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400">Start Time Slot</span>
                  <div className="font-semibold text-white">{slot?.time || `Slot ID #${booking.slot_id}`}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/70">
                <Users size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400">Players Reserved</span>
                  <div className="font-semibold text-white">{booking.number_of_players} players (Capacity 15)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950/70">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400">Payment Status</span>
                  <div className="font-semibold text-white font-mono uppercase">
                    {payment?.status || (isInitializingPayment ? 'Initializing...' : 'Pending')}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Price Calculated by Backend */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 font-semibold">Total Match Amount</span>
                <p className="text-[11px] text-slate-500">
                  {payment ? `Amount from Payment #${payment.id}` : 'Calculated by backend pricing engine'}
                </p>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                ₹{(payment?.amount ?? booking.total_price).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              {isInitializingPayment ? (
                <div className="flex items-center justify-center p-4">
                  <LoadingSpinner size="sm" label="Setting up payment session..." />
                </div>
              ) : (
                <Button
                  size="lg"
                  disabled={!payment || isVerifyingPayment || timeLeft.isExpired}
                  isLoading={isVerifyingPayment}
                  onClick={handlePayment}
                  className="w-full justify-center shadow-xl shadow-emerald-500/25"
                  leftIcon={!isVerifyingPayment && <CreditCard size={18} />}
                >
                  {timeLeft.isExpired
                    ? 'Hold Expired — Rebook Slot'
                    : isVerifyingPayment
                      ? 'Verifying Payment...'
                      : `Pay ₹${(payment?.amount ?? booking.total_price).toLocaleString('en-IN')}`}
                </Button>
              )}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldAlert size={12} className="text-slate-400" />
                <span>Secure payment will transition your booking status to confirmed after verification.</span>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    </PageTransition>
  );
}