import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import {
  Activity,
  Layers,
  CalendarCheck,
  PlusCircle,
  Clock,
  Calendar,
  IndianRupee,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  Radio,
  Sparkles,
} from 'lucide-react';
import { Card, Button, Badge, Input } from '@/components/common';
import { LoadingSpinner, EmptyState } from '@/components/feedback';
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';
import { getAllSlots, getAdminBookings, createSlot } from '@/features/booking/api';
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

  // Form State for POST /slots/
  const [formData, setFormData] = useState({
    sport_id: 1,
    slot_date: '',
    start_time: '10:00:00',
    end_time: '11:00:00',
    price: 500,
  });
  const [fieldErrors, setFieldErrors] = useState<{
    sport_id?: string;
    slot_date?: string;
    start_time?: string;
    end_time?: string;
    price?: string;
  }>({});
  const [isCreatingSlot, setIsCreatingSlot] = useState<boolean>(false);
  const [createSlotError, setCreateSlotError] = useState<string | null>(null);
  const [createSlotSuccess, setCreateSlotSuccess] = useState<string | null>(null);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'slots' | 'bookings' | 'create'>('slots');

  // Fetch Slots
  const fetchSlotsData = async () => {
    setIsLoadingSlots(true);
    setSlotsError(null);
    try {
      const data = await getAllSlots();
      setSlots(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setSlotsError('Authentication required. Please sign in as an admin.');
      } else {
        setSlotsError('Unable to load slots. Please check connection and try again.');
      }
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Fetch Bookings
  const fetchBookingsData = async () => {
    setIsLoadingBookings(true);
    setBookingsError(null);
    try {
      const data = await getAdminBookings();
      setBookings(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setBookingsError('Authentication required. Please sign in as an admin.');
      } else {
        setBookingsError('Unable to load bookings. Please check connection and try again.');
      }
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchSlotsData();
    fetchBookingsData();
  }, []);

  // Derived Local Presentation Metrics
  const totalSlots = slots.length;
  const availableSlotsCount = slots.filter((s) => s.is_available).length;
  const unavailableSlotsCount = totalSlots - availableSlotsCount;

  const totalBookingsCount = bookings.length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const heldBookingsCount = bookings.filter((b) => b.status === 'held').length;
  const cancelledBookingsCount = bookings.filter((b) => b.status === 'cancelled').length;
  const totalBookingValue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  // Handle Form Change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sport_id' || name === 'price' ? Number(value) : value,
    }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setCreateSlotError(null);
    setCreateSlotSuccess(null);
  };

  // Validate Slot Form
  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!formData.sport_id || formData.sport_id <= 0) {
      errors.sport_id = 'Sport ID must be a positive number.';
    }
    if (!formData.slot_date) {
      errors.slot_date = 'Slot date is required.';
    }
    if (!formData.start_time) {
      errors.start_time = 'Start time is required (e.g. 10:00:00).';
    }
    if (!formData.end_time) {
      errors.end_time = 'End time is required (e.g. 11:00:00).';
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = 'Price must be greater than 0.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit POST /slots/
  const handleCreateSlotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsCreatingSlot(true);
    setCreateSlotError(null);
    setCreateSlotSuccess(null);

    // Format start_time and end_time to ensure HH:mm:ss
    let formattedStart = formData.start_time;
    if (formattedStart.length === 5) formattedStart += ':00';

    let formattedEnd = formData.end_time;
    if (formattedEnd.length === 5) formattedEnd += ':00';

    try {
      await createSlot({
        sport_id: Number(formData.sport_id),
        slot_date: formData.slot_date,
        start_time: formattedStart,
        end_time: formattedEnd,
        price: Number(formData.price),
      });

      setCreateSlotSuccess(`Slot on ${formData.slot_date} (${formattedStart} - ${formattedEnd}) created successfully.`);
      // Refresh real slot dataset
      fetchSlotsData();
      // Reset date
      setFormData((prev) => ({ ...prev, slot_date: '' }));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setCreateSlotError('Sport not found. Please verify the Sport ID.');
        } else if (err.response?.status === 409) {
          setCreateSlotError('This time slot already exists for the given date.');
        } else if (err.response?.status === 401) {
          setCreateSlotError('Authentication required. Admin privileges required.');
        } else {
          setCreateSlotError('Failed to create slot. Please check the entered parameters.');
        }
      } else {
        setCreateSlotError('An unexpected error occurred during slot creation.');
      }
    } finally {
      setIsCreatingSlot(false);
    }
  };

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
              Monitor turf availability, inspect bookings, and provision match slots.
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

        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'create'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <PlusCircle size={14} /> Create Slot
        </button>
      </div>

      {/* 4. Tab 1: Real Slots Overview */}
      {activeTab === 'slots' && (
        <FadeIn direction="up">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                All Provisioned Turf Slots
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
                description="Use the 'Create Slot' tab to add available play times to the court schedule."
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
      {activeTab === 'create' && (
        <FadeIn direction="up">
          <div className="max-w-xl">
            <Card className="p-6 border-slate-800 bg-slate-900/90 shadow-2xl space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="brand" className="text-[10px] px-2 py-0.5">
                    <Sparkles size={11} className="mr-1 inline" /> PROVISIONING
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">POST /slots/</span>
                </div>
                <h2 className="mt-2 text-lg font-bold text-white uppercase tracking-wide">
                  Provision New Turf Slot
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Add a new play window to the live court availability schedule.
                </p>
              </div>

              {createSlotSuccess && (
                <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 text-xs text-emerald-300">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{createSlotSuccess}</span>
                </div>
              )}

              {createSlotError && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3.5 text-xs text-rose-300"
                >
                  <XCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{createSlotError}</span>
                </div>
              )}

              <form onSubmit={handleCreateSlotSubmit} noValidate className="space-y-4">
                <Input
                  label="Sport Identifier (ID)"
                  type="number"
                  name="sport_id"
                  id="sport_id"
                  required
                  min={1}
                  value={formData.sport_id}
                  onChange={handleInputChange}
                  error={fieldErrors.sport_id}
                  disabled={isCreatingSlot}
                />

                <Input
                  label="Slot Date (YYYY-MM-DD)"
                  type="date"
                  name="slot_date"
                  id="slot_date"
                  required
                  value={formData.slot_date}
                  onChange={handleInputChange}
                  error={fieldErrors.slot_date}
                  disabled={isCreatingSlot}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Start Time (HH:mm:ss)"
                    type="text"
                    name="start_time"
                    id="start_time"
                    required
                    placeholder="10:00:00"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    error={fieldErrors.start_time}
                    disabled={isCreatingSlot}
                  />

                  <Input
                    label="End Time (HH:mm:ss)"
                    type="text"
                    name="end_time"
                    id="end_time"
                    required
                    placeholder="11:00:00"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    error={fieldErrors.end_time}
                    disabled={isCreatingSlot}
                  />
                </div>

                <Input
                  label="Price (INR ₹)"
                  type="number"
                  name="price"
                  id="price"
                  required
                  min={1}
                  value={formData.price}
                  onChange={handleInputChange}
                  error={fieldErrors.price}
                  disabled={isCreatingSlot}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={isCreatingSlot}
                    disabled={isCreatingSlot}
                    className="w-full justify-center shadow-xl shadow-emerald-500/25"
                    leftIcon={!isCreatingSlot && <PlusCircle size={16} />}
                  >
                    {isCreatingSlot ? 'Creating Slot...' : 'Create Turf Slot'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </FadeIn>
      )}
    </PageTransition>
  );
}