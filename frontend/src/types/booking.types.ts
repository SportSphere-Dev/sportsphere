export type SlotStatus = 'available' | 'held' | 'booked' | 'blocked';

export interface Slot {
  id: string;
  startTime: string; // ISO 8601 string or HH:mm format
  endTime: string;
  status: SlotStatus;
  price: number;
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
  durationHours: number; // Max 5 hours per business rules
  playerCount: number; // Base max is 15; extras charged at centre
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