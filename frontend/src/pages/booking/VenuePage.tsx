import {
  VenueHero,
  VenueInformation,
  BookingInformation,
} from '@/features/booking';
import { PageTransition } from '@/components/motion';

export default function VenuePage() {
  return (
    <PageTransition className="flex flex-col">
      <VenueHero />
      <VenueInformation />
      <BookingInformation />
    </PageTransition>
  );
}