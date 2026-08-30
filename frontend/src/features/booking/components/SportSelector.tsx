import type { SportResponse } from '../api';

interface SportSelectorProps {
  sports: SportResponse[];
  selectedSportId: number | null;
  onSelectSport: (sportId: number) => void;
  disabled?: boolean;
}

export default function SportSelector({
  sports,
  selectedSportId,
  onSelectSport,
  disabled = false,
}: SportSelectorProps) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Choose Your Sport
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Select the sport you want to play.
        </p>
      </div>

      {sports.length === 0 ? (
        <p className="text-sm text-slate-400">
          No sports are currently available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sports.map((sport) => {
            const isSelected = selectedSportId === sport.id;

            return (
              <button
                key={sport.id}
                type="button"
                disabled={disabled}
                onClick={() => onSelectSport(sport.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-900 hover:border-slate-500'
                } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="font-bold text-white">
                  {sport.name}
                </div>

                {sport.description && (
                  <div className="mt-1 text-xs text-slate-400">
                    {sport.description}
                  </div>
                )}

                <div className="mt-3 text-sm font-semibold text-emerald-400">
                  ₹{sport.price_per_hour.toLocaleString('en-IN')}/hour
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}