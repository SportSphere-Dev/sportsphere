import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Ban,
  Activity,
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/common';
import { LoadingSpinner, EmptyState } from '@/components/feedback';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { getMyBookings } from '@/features/booking/api';
import type { BackendBookingResponse } from '@/types';

function HeldBookingCountdown({ expiresAt }: { expiresAt: string | null }) {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number; isExpired: boolean }>({
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!expiresAt) return;

    const calculateTime = () => {
      const targetTime = new Date(expiresAt).getTime();
      const now = Date.now();
      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      setTimeLeft({ minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div
      className={`mt-3 flex items-center justify-between rounded-lg px-3 py-2 text-xs border ${
        timeLeft.isExpired
          ? 'border-rose-500/30 bg-rose-950/20 text-rose-400'
          : 'border-amber-500/30 bg-amber-950/20 text-amber-300'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Clock size={13} className="shrink-0" />
        <span>{timeLeft.isExpired ? 'Hold time expired' : 'Hold active'}</span>
      </div>
      <span className="font-mono font-bold">
        {timeLeft.isExpired ? '00:00' : `${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
      </span>
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BackendBookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setErrorMessage('Your session has expired. Please sign in again.');
        } else if (!err.response) {
          setErrorMessage('Unable to load your bookings. Please check your connection and try again.');
        } else {
          setErrorMessage('An unexpected error occurred while loading your bookings.');
        }
      } else {
        setErrorMessage('Failed to load bookings. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusBadge = (status: BackendBookingResponse['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="success" className="text-[10px] gap-1 px-2 py-0.5">
            <CheckCircle2 size={11} className="inline text-emerald-400" /> Confirmed
          </Badge>
        );
      case 'held':
        return (
          <Badge variant="warning" className="text-[10px] gap-1 px-2 py-0.5">
            <Clock size={11} className="inline text-amber-400" /> On Hold
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="neutral" className="text-[10px] gap-1 px-2 py-0.5 text-slate-400">
            <Ban size={11} className="inline text-slate-500" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Dashboard Header */}
        <FadeIn direction="up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-2">
                <Badge variant="brand" className="text-[10px] px-2.5 py-0.5">
                  <Activity size={12} className="mr-1 inline" />
                  CUSTOMER DASHBOARD
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Account Reservations
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                My Turf Bookings
              </h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                View your confirmed match sessions and temporary booking holds.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/booking">
                <Button size="md" className="shadow-lg shadow-emerald-500/20" rightIcon={<ArrowRight size={15} />}>
                  Book New Slot
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Content States */}
        <div className="mt-8">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8">
              <LoadingSpinner size="lg" label="Retrieving your bookings..." />
            </div>
          ) : errorMessage ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center">
              <AlertTriangle size={32} className="text-rose-400 mb-2" />
              <p className="text-sm font-semibold text-white">{errorMessage}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchBookings}
                className="mt-4"
                leftIcon={<RotateCcw size={14} />}
              >
                Try Again
              </Button>
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="Your confirmed and upcoming turf bookings will appear here once reserved."
              icon={<Calendar size={28} className="text-slate-400" />}
              action={
                <Link to="/booking">
                  <Button size="md" className="mt-4" rightIcon={<ArrowRight size={16} />}>
                    Book a Turf
                  </Button>
                </Link>
              }
            />
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookings.map((bookingItem) => {
                let formattedCreatedAt = bookingItem.created_at;
                try {
                  formattedCreatedAt = format(parseISO(bookingItem.created_at), 'dd MMM yyyy, hh:mm a');
                } catch {
                  // Fallback to raw string if parsing fails
                }

                return (
                  <StaggerItem key={bookingItem.id}>
                    <Card className="flex flex-col justify-between p-5 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-all duration-200 shadow-xl">
                      <div>
                        {/* Header: ID and Status */}
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block">REFERENCE</span>
                            <span className="text-sm font-bold font-mono text-white">#{bookingItem.id}</span>
                          </div>
                          {getStatusBadge(bookingItem.status)}
                        </div>

                        {/* Breakdown */}
                        <div className="mt-4 space-y-2.5 text-xs">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Calendar size={13} className="text-emerald-400" /> Slot Identifier
                            </span>
                            <span className="font-semibold text-white font-mono">Slot #{bookingItem.slot_id}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Users size={13} className="text-emerald-400" /> Match Players
                            </span>
                            <span className="font-semibold text-white">
                              {bookingItem.number_of_players} players
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1.5 text-slate-400">
                              <Clock size={13} className="text-emerald-400" /> Booked On
                            </span>
                            <span className="text-slate-300 text-[11px]">{formattedCreatedAt}</span>
                          </div>
                        </div>

                        {/* Held Countdown if Active */}
                        {bookingItem.status === 'held' && (
                          <HeldBookingCountdown expiresAt={bookingItem.hold_expires_at} />
                        )}
                      </div>

                      {/* Footer: Price */}
                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Total Price</span>
                        <span className="text-base font-black font-mono text-emerald-400">
                          ₹{bookingItem.total_price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </div>
    </PageTransition>
  );
}