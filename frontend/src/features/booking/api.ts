import apiClient from '@/api/client';
import type { BackendSlotResponse, Slot } from '@/types';

export interface GetSlotsParams {
  sportId: number;
  date: string; // YYYY-MM-DD format
  signal?: AbortSignal;
}

/**
 * Parses time strings (ISO format or HH:mm:ss / HH:mm) into a clean 12-hour display format.
 */
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

/**
 * Determines whether a slot falls into Morning, Afternoon, or Evening/Peak.
 */
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

/**
 * Normalizes backend slot entity into frontend Slot interface.
 */
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

/**
 * Fetches slot records from GET /slots/
 */
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