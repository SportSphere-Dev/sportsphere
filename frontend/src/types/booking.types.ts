export type SlotStatus = 'available' | 'held' | 'booked' | 'blocked';

export interface TurfSlotResponse {
  id: number;
  sport_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  price: number;
  is_available: boolean;
}

export interface BackendSlotResponse {
  id: number;
  sport_id: number;
  start_time: string;
  end_time: string;
  status: SlotStatus;
  price?: number;
}

export interface CreateSlotRequest {
  sport_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  price: number;
}

export interface Slot {
  id: string;
  sportId?: number;
  time: string;
  startTime: string;
  endTime: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  status: SlotStatus;
  price?: number;
  isPeak?: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity?: number;
}

export type BookingStatus = 'held' | 'confirmed' | 'cancelled';

export interface CreateBookingRequest {
  slot_id: number;
  number_of_players: number;
}

export interface BackendBookingResponse {
  id: number;
  user_id: number;
  slot_id: number;
  number_of_players: number;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  hold_expires_at: string | null;
}

export interface AdminBookingResponse {
  id: number;
  user_id: number;
  slot_id: number;
  number_of_players: number;
  status: string;
  total_price: number;
  created_at: string;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  playerCount: number;
  addOns: AddOn[];
  subtotal: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
  holdExpiresAt?: string | null;
}

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface CreatePaymentRequest {
  booking_id: number;
}

export interface VerifyPaymentRequest {
  payment_id: number;
  success: boolean;
}

export interface BackendPaymentResponse {
  id: number;
  booking_id: number;
  amount: number;
  status: PaymentStatus;
  provider: string;
  provider_payment_id: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  provider?: string;
  providerPaymentId?: string | null;
  createdAt?: string;
}