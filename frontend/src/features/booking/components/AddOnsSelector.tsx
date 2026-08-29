import { PackagePlus, Info } from 'lucide-react';
import { Card, Badge } from '@/components/common';

export interface AddOnsSelectorProps {
  selectedAddOns: string[];
  onToggleAddOn: (id: string) => void;
}

const mockAvailableAddOns = [
  {
    id: 'addon-match-ball',
    name: 'Official Match Football',
    description: 'Size 5 FIFA-standard synthetic leather match ball.',
  },
  {
    id: 'addon-training-bibs',
    name: 'Team Training Bibs Set',
    description: 'Set of 10 breathable scrimmage bibs (2 colours).',
  },
];

export default function AddOnsSelector({
  selectedAddOns,
  onToggleAddOn,
}: AddOnsSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PackagePlus size={18} className="text-emerald-400" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-white">Materials & Add-ons</h2>
        </div>
        <Badge variant="neutral" className="text-[10px]">Optional</Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {mockAvailableAddOns.map((item) => {
          const isSelected = selectedAddOns.includes(item.id);

          return (
            <Card
              key={item.id}
              variant="interactive"
              role="checkbox"
              tabIndex={0}
              aria-checked={isSelected}
              onClick={() => onToggleAddOn(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleAddOn(item.id);
                }
              }}
              className={`flex flex-col justify-between p-4 transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{item.name}</span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    {isSelected && (
                      <span className="text-[10px] font-black">✓</span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">{item.description}</p>
              </div>

              <div className="mt-3 flex items-center gap-1 text-[11px] italic text-slate-500">
                <Info size={12} />
                <span>Price configured by venue</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}