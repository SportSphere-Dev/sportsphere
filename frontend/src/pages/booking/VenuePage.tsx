import {
  VenueHero,
  VenueGallery,
  VenueDiagram,
  VenueFacilityShowcase,
  VenueImmersiveSection,
  BookingExperiencePreview,
  BookingInformation,
  VenueFinalCta,
} from '@/features/booking';
import { PageTransition } from '@/components/motion';

export default function VenuePage() {
  return (
    <PageTransition className="flex flex-col">
      <VenueHero />
      <VenueGallery />
      <VenueDiagram />
      <VenueFacilityShowcase />
      <VenueImmersiveSection />
      <BookingExperiencePreview />
      <BookingInformation />
      <VenueFinalCta />
    </PageTransition>
  );
}