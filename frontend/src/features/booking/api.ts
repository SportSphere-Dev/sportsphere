import apiClient from '@/api/client';
import type {
  BackendSlotResponse,
  Slot,
  CreateBookingRequest,
  BackendBookingResponse,
  CreatePaymentRequest,
  VerifyPaymentRequest,
  BackendPaymentResponse,
  TurfSlotResponse,
  AdminBookingResponse,
  CreateSlotRequest,
} from '@/types';

export interface GetSlotsParams {
  sportId: number;
  date: string; // YYYY-MM-DD format
  signal?: AbortSignal;
}

function formatDisplayTime(timeStr: string): string {
  if (!timeStr) return '';

  if (timeStr.includes('T')) {
    const timePart = timeStr.split('T')[1];
    const [hours, minutes] = timePart.split(':');
    const h = parseInt(hours, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, '0')}:${minutes} ${period}`;
  }

  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH.toString().padStart(2, '0')}:${minutes} ${period}`;
}

function getSlotPeriod(timeStr: string): 'Morning' | 'Afternoon' | 'Evening' {
  let hour = 0;
  if (timeStr.includes('T')) {
    const timePart = timeStr.split('T')[1];
    hour = parseInt(timePart.split(':')[0], 10);
  } else {
    hour = parseInt(timeStr.split(':')[0], 10);
  }

  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

export function mapBackendSlot(backendSlot: BackendSlotResponse): Slot {
  const period = getSlotPeriod(backendSlot.start_time);
  const displayTime = formatDisplayTime(backendSlot.start_time);
  const hour = backendSlot.start_time.includes('T')
    ? parseInt(backendSlot.start_time.split('T')[1].split(':')[0], 10)
    : parseInt(backendSlot.start_time.split(':')[0], 10);

  return {
    id: String(backendSlot.id),
    sportId: backendSlot.sport_id,
    time: displayTime,
    startTime: backendSlot.start_time,
    endTime: backendSlot.end_time,
    period,
    status: backendSlot.status || 'available',
    price: backendSlot.price,
    isPeak: hour >= 18,
  };
}

export async function getSlots({ sportId, date, signal }: GetSlotsParams): Promise<Slot[]> {
  const response = await apiClient.get<BackendSlotResponse[]>('/slots/', {
    params: {
      sport_id: sportId,
      date,
    },
    signal,
  });

  if (!Array.isArray(response.data)) {
    return [];
  }

  return response.data.map(mapBackendSlot);
}

/**
 * Creates a slot reservation hold via POST /bookings/
 */
export async function createBooking(payload: CreateBookingRequest): Promise<BackendBookingResponse> {
  const response = await apiClient.post<BackendBookingResponse>('/bookings/', payload);
  return response.data;
}

/**
 * Initiates a payment session via POST /payments/
 */
export async function createPayment(payload: CreatePaymentRequest): Promise<BackendPaymentResponse> {
  const response = await apiClient.post<BackendPaymentResponse>('/payments/', payload);
  return response.data;
}

/**
 * Verifies/simulates payment completion via POST /payments/verify
 */
export async function verifyPayment(payload: VerifyPaymentRequest): Promise<BackendPaymentResponse> {
  const response = await apiClient.post<BackendPaymentResponse>('/payments/verify', payload);
  return response.data;
}

/**
 * Fetches all bookings belonging to the authenticated customer via GET /bookings/my
 */
export async function getMyBookings(): Promise<BackendBookingResponse[]> {
  const response = await apiClient.get<BackendBookingResponse[]>('/bookings/my');
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Fetches a single booking by ID via GET /bookings/{booking_id}
 */
export async function getBookingById(bookingId: number): Promise<BackendBookingResponse> {
  const response = await apiClient.get<BackendBookingResponse>(`/bookings/${bookingId}`);
  return response.data;
}

/**
 * Admin: Fetches all turf slots via GET /slots/
 */
export async function getAllSlots(): Promise<TurfSlotResponse[]> {
  const response = await apiClient.get<TurfSlotResponse[]>('/slots/');
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Admin: Fetches all system bookings via GET /bookings/admin
 */
export async function getAdminBookings(): Promise<AdminBookingResponse[]> {
  const response = await apiClient.get<AdminBookingResponse[]>('/bookings/admin');
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Admin: Creates a new turf slot via POST /slots/
 */
export async function createSlot(payload: CreateSlotRequest): Promise<TurfSlotResponse> {
  const response = await apiClient.post<TurfSlotResponse>('/slots/', payload);
  return response.data;
}