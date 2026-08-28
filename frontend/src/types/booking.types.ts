export type SlotStatus = 'available' | 'held' | 'booked' | 'blocked';

export interface BackendSlotResponse {
  id: number;
  sport_id: number;
  start_time: string; // "YYYY-MM-DDTHH:mm:ss" or "HH:mm:ss" / "HH:mm"
  end_time: string;
  status: SlotStatus;
  price?: number;
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

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  durationHours: number; // Max 5 hours
  playerCount: number; // Standard 15
  addOns: AddOn[];
  subtotal: number;
  totalAmount: number;
  status: BookingStatus;
  createdAt: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  status: PaymentStatus;
  transactionReference?: string;
  paidAt?: string;
}