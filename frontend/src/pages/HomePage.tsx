import {
  HeroSection,
  HowItWorks,
  BenefitsSection,
  BookingRulesPreview,
  FinalCta,
} from '@/features/home';
import { PageTransition } from '@/components/motion';

export default function HomePage() {
  return (
    <PageTransition className="flex flex-col">
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <BookingRulesPreview />
      <FinalCta />
    </PageTransition>
  );
}