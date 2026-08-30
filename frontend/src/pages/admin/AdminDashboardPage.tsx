import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import {
  Activity,
  Layers,
  CalendarCheck,
  Clock,
  Calendar,
  IndianRupee,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Radio,
} from 'lucide-react';

import { Card, Button, Badge } from '@/components/common';
import { LoadingSpinner, EmptyState } from '@/components/feedback';
import {
  PageTransition,
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from '@/components/motion';

import { getAllSlots, getAdminBookings } from '@/features/booking/api';
import type { TurfSlotResponse, AdminBookingResponse } from '@/types';

export default function AdminDashboardPage() {
  // Data States
  const [slots, setSlots] = useState<TurfSlotResponse[]>([]);
  const [bookings, setBookings] = useState<AdminBookingResponse[]>([]);

  // Loading & Error States
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<'slots' | 'bookings'>('slots');

  // Fetch slots
  const fetchSlotsData = async () => {
    setIsLoadingSlots(true);
    setSlotsError(null);

    try {
      const response = await getAllSlots();
      setSlots(response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setSlotsError(
          error.response?.data?.detail ||
            'Unable to load turf availability.'
        );
      } else {
        setSlotsError('Unable to load turf availability.');
      }
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Fetch bookings
  const fetchBookingsData = async () => {
    setIsLoadingBookings(true);
    setBookingsError(null);

    try {
      const response = await getAdminBookings();
      setBookings(response);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setBookingsError(
          error.response?.data?.detail ||
            'Unable to load bookings.'
        );
      } else {
        setBookingsError('Unable to load bookings.');
      }
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Initial dashboard load
  useEffect(() => {
    fetchSlotsData();
    fetchBookingsData();
  }, []);

  // Derived slot metrics
  const totalSlots = slots.length;

  const availableSlotsCount = slots.filter(
    (slot) => slot.is_available
  ).length;

  const unavailableSlotsCount = slots.filter(
    (slot) => !slot.is_available
  ).length;

  // Derived booking metrics
  const totalBookingsCount = bookings.length;

  const confirmedBookingsCount = bookings.filter(
    (booking) => booking.status === 'confirmed'
  ).length;

  const heldBookingsCount = bookings.filter(
    (booking) => booking.status === 'held'
  ).length;

  const cancelledBookingsCount = bookings.filter(
    (booking) => booking.status === 'cancelled'
  ).length;

  const totalBookingValue = bookings.reduce(
    (total, booking) => total + booking.total_price,
    0
  );
  
  // Format Helper for Slot Display
  const formatSlotTime = (timeStr: string) => {
    try {
      const [h, m] = timeStr.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${displayHour.toString().padStart(2, '0')}:${m} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <PageTransition className="space-y-8">
      {/* 1. Header */}
      <FadeIn direction="up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2">
              <Badge variant="warning" className="text-[10px] px-2 py-0.5">
                <Radio size={12} className="mr-1 inline text-amber-400" />
                ADMINISTRATION
              </Badge>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Facility Control Panel
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Management Dashboard
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Monitor turf availability and inspect customer bookings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                fetchSlotsData();
                fetchBookingsData();
              }}
              leftIcon={<RotateCcw size={14} />}
              className="border-slate-800 bg-slate-900"
            >
              Refresh All Data
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* 2. Derived Summary Metric Cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <Card className="p-4 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Provisioned Slots</span>
              <Layers size={16} className="text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">{totalSlots}</div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="text-emerald-400 font-semibold">{availableSlotsCount} Available</span>
              <span className="text-rose-400 font-semibold">{unavailableSlotsCount} Unavailable</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="p-4 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Bookings</span>
              <CalendarCheck size={16} className="text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">{totalBookingsCount}</div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="text-emerald-400 font-semibold">{confirmedBookingsCount} Confirmed</span>
              <span className="text-amber-400 font-semibold">{heldBookingsCount} Held</span>
              <span className="text-slate-500 font-semibold">{cancelledBookingsCount} Cancelled</span>
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="p-4 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Booking Value</span>
              <IndianRupee size={16} className="text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
              ₹{totalBookingValue.toLocaleString('en-IN')}
            </div>
            <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
              DERIVED SUM (ALL RECORDS)
            </div>
          </Card>
        </StaggerItem>

        <StaggerItem>
          <Card className="p-4 border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Primary Sport Target</span>
              <Activity size={16} className="text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black font-mono text-white">Sport #1</div>
            <div className="mt-2 text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 font-mono">
              SINGLE VENUE TURF
            </div>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('slots')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'slots'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers size={14} /> Slots List ({totalSlots})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'bookings'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CalendarCheck size={14} /> Bookings Activity ({totalBookingsCount})
        </button>

        
      </div>

      {/* 4. Tab 1: Real Slots Overview */}
      {activeTab === 'slots' && (
        <FadeIn direction="up">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Generated Turf Availability
              </h2>
              <span className="text-xs text-slate-500 font-mono">Source: GET /slots/</span>
            </div>

            {isLoadingSlots ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
                <LoadingSpinner size="md" label="Loading turf slots..." />
              </div>
            ) : slotsError ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center">
                <AlertTriangle size={28} className="text-rose-400 mb-2" />
                <p className="text-xs text-rose-300 font-semibold">{slotsError}</p>
                <Button size="sm" variant="secondary" onClick={fetchSlotsData} className="mt-4" leftIcon={<RotateCcw size={13} />}>
                  Retry
                </Button>
              </div>
            ) : slots.length === 0 ? (
              <EmptyState
                title="No slots provisioned yet"
                description="Availability is generated automatically when customers select a sport and date."
                icon={<Layers size={24} className="text-slate-400" />}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {slots.map((slotItem) => (
                  <Card key={slotItem.id} className="p-4 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs font-bold font-mono text-white">SLOT #{slotItem.id}</span>
                      <Badge variant={slotItem.is_available ? 'success' : 'error'} className="text-[10px] px-2">
                        {slotItem.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Calendar size={13} className="text-emerald-400" /> Date
                        </span>
                        <span className="font-semibold text-white">{slotItem.slot_date}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Clock size={13} className="text-emerald-400" /> Time Window
                        </span>
                        <span className="font-semibold text-white font-mono">
                          {formatSlotTime(slotItem.start_time)} – {formatSlotTime(slotItem.end_time)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Sport Identifier</span>
                        <span className="font-mono text-slate-300">Sport #{slotItem.sport_id}</span>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Slot Rate</span>
                      <span className="font-mono font-bold text-sm text-emerald-400">
                        ₹{slotItem.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* 5. Tab 2: Real Bookings Overview */}
      {activeTab === 'bookings' && (
        <FadeIn direction="up">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                System Booking Activity
              </h2>
              <span className="text-xs text-slate-500 font-mono">Source: GET /bookings/admin</span>
            </div>

            {isLoadingBookings ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
                <LoadingSpinner size="md" label="Loading system bookings..." />
              </div>
            ) : bookingsError ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center">
                <AlertTriangle size={28} className="text-rose-400 mb-2" />
                <p className="text-xs text-rose-300 font-semibold">{bookingsError}</p>
                <Button size="sm" variant="secondary" onClick={fetchBookingsData} className="mt-4" leftIcon={<RotateCcw size={13} />}>
                  Retry
                </Button>
              </div>
            ) : bookings.length === 0 ? (
              <EmptyState
                title="No bookings recorded yet"
                description="Customer slot reservations will appear here once players initiate checkout holds or confirmations."
                icon={<CalendarCheck size={24} className="text-slate-400" />}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {bookings.map((bookingItem) => {
                  let formattedDate = bookingItem.created_at;
                  try {
                    formattedDate = format(parseISO(bookingItem.created_at), 'dd MMM yyyy, hh:mm a');
                  } catch {
                    // fallback
                  }

                  const isConfirmed = bookingItem.status === 'confirmed';
                  const isHeld = bookingItem.status === 'held';

                  return (
                    <Card key={bookingItem.id} className="p-4 border-slate-800 bg-slate-900/80 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <span className="text-xs font-bold font-mono text-white">BOOKING #{bookingItem.id}</span>
                        <Badge
                          variant={isConfirmed ? 'success' : isHeld ? 'warning' : 'neutral'}
                          className="text-[10px] px-2"
                        >
                          {isConfirmed ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 size={10} /> Confirmed
                            </span>
                          ) : isHeld ? (
                            <span className="flex items-center gap-1">
                              <Clock size={10} /> Held
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Ban size={10} /> {bookingItem.status}
                            </span>
                          )}
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Customer ID</span>
                          <span className="font-mono text-white font-semibold">User #{bookingItem.user_id}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Slot Reference</span>
                          <span className="font-mono text-white font-semibold">Slot #{bookingItem.slot_id}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Players Reserved</span>
                          <span className="font-semibold text-white">{bookingItem.number_of_players} players</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-400">Created At</span>
                          <span className="text-slate-300 text-[11px]">{formattedDate}</span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Total Price</span>
                        <span className="font-mono font-bold text-sm text-emerald-400">
                          ₹{bookingItem.total_price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {/* 6. Tab 3: Create Slot Form */}
    </PageTransition>
  );
}