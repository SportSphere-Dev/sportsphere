import { Users, Plus, Minus, Info } from 'lucide-react';
import { Card } from '@/components/common';

export interface PlayerCountSelectorProps {
  playerCount: number;
  onChangePlayerCount: (count: number) => void;
}

export default function PlayerCountSelector({
  playerCount,
  onChangePlayerCount,
}: PlayerCountSelectorProps) {
  const handleDecrement = () => {
    if (playerCount > 1) onChangePlayerCount(playerCount - 1);
  };

  const handleIncrement = () => {
    onChangePlayerCount(playerCount + 1);
  };

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-emerald-400" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-white">Player Count</h3>
          </div>
          <p className="text-xs text-slate-400">
            Base standard capacity: <span className="text-slate-200 font-medium">Up to 15 players included</span>.
          </p>
        </div>

        {/* Counter UI */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={playerCount <= 1}
            aria-label="Decrease player count"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 transition-colors hover:bg-slate-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Minus size={15} />
          </button>

          <div className="flex min-w-[3rem] items-center justify-center text-base font-bold text-white">
            {playerCount}
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            aria-label="Increase player count"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 transition-colors hover:bg-slate-700 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      {playerCount > 15 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs text-amber-300">
          <Info size={15} className="shrink-0 mt-0.5" />
          <span>Additional player charges beyond 15 players are settled directly at the venue centre.</span>
        </div>
      )}
    </Card>
  );
}