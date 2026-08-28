import {
  VenueHero,
  VenueDiagram,
  VenueFacilityShowcase,
  BookingExperiencePreview,
  BookingInformation,
  VenueFinalCta,
} from '@/features/booking';
import { PageTransition } from '@/components/motion';

export default function VenuePage() {
  return (
    <PageTransition className="flex flex-col">
      <VenueHero />
      <VenueDiagram />
      <VenueFacilityShowcase />
      <BookingExperiencePreview />
      <BookingInformation />
      <VenueFinalCta />
    </PageTransition>
  );
}