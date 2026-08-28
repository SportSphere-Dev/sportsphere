import {
  VenueHero,
  VenueInformation,
  BookingInformation,
} from '@/features/booking';

export default function VenuePage() {
  return (
    <div className="flex flex-col">
      <VenueHero />
      <VenueInformation />
      <BookingInformation />
    </div>
  );
}