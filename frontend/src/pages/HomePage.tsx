import {
  HeroSection,
  HowItWorks,
  BenefitsSection,
  BookingRulesPreview,
  FinalCta,
} from '@/features/home';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <HowItWorks />
      <BenefitsSection />
      <BookingRulesPreview />
      <FinalCta />
    </div>
  );
}