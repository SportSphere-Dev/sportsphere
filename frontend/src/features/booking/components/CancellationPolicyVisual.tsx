import { ShieldCheck, AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/motion';

const cancellationTiers = [
  {
    timeframe: '2+ Days Before',
    refund: '100% Refund',
    description: 'Full refund credited if cancellation occurs 48 hours or more prior to slot time.',
    badge: 'Full Refund',
    variant: 'success' as const,
    icon: ShieldCheck,
  },
  {
    timeframe: '1 Day Before',
    refund: '75% Refund',
    description: 'Partial 75% refund credited if cancelled between 24 and 48 hours prior to start.',
    badge: 'Partial Refund',
    variant: 'warning' as const,
    icon: AlertCircle,
  },
  {
    timeframe: '< 1 Day Before',
    refund: 'No Refund',
    description: 'No refund provided for late cancellations within 24 hours of match start time.',
    badge: 'Non-Refundable',
    variant: 'error' as const,
    icon: XCircle,
  },
];

export default function CancellationPolicyVisual() {
  return (
    <div className="mt-8 space-y-6">
      <FadeIn direction="up">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Cancellation & Refund Timeline</h3>
            <p className="text-xs text-slate-400">Clear tiered refund policy based on notice period.</p>
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cancellationTiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <StaggerItem key={tier.timeframe}>
              <Card variant="interactive" className="flex h-full flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-slate-800 p-2 text-slate-300">
                      <Icon size={18} />
                    </div>
                    <Badge variant={tier.variant} className="text-[10px]">
                      {tier.badge}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-slate-400">{tier.timeframe}</span>
                    <div className="text-lg font-bold text-white">{tier.refund}</div>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{tier.description}</p>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Rescheduling & Account Policy Note */}
      <FadeIn direction="up" delay={0.1}>
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="flex items-start gap-3 text-xs text-slate-300">
            <RefreshCw size={16} className="mt-0.5 shrink-0 text-emerald-400" />
            <div>
              <span className="font-semibold text-white">Rescheduling Policy:</span> Active bookings can be rescheduled provided the same number of hours are available within the next 5 days. Frequent cancellations (more than 10 times) may result in account review.
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}