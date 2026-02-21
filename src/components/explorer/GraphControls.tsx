import { useCallback, useRef } from 'react';
import { useExplorerStore } from '../../store/useExplorerStore';
import { type ScaleLevel, ALL_SCALES, SCALE_LABELS, SCALE_COLORS } from '../../types/pattern';

interface GraphControlsProps {
  onZoomReset: () => void;
}

export function GraphControls({ onZoomReset }: GraphControlsProps) {
  const { activeScales, toggleScale, clearScaleFilter, searchQuery, setSearchQuery } = useExplorerStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 250);
  }, [setSearchQuery]);

  return (
    <div className="flex flex-col gap-2 p-3 bg-[var(--color-bark)] border-b border-[var(--color-stone)]">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-clay)] text-sm">⌕</span>
          <input
            type="text"
            placeholder="Search patterns..."
            defaultValue={searchQuery}
            onChange={handleSearch}
            className="w-full pl-7 pr-3 py-1.5 bg-[var(--color-soil)] border border-[var(--color-stone)] rounded text-sm text-[var(--color-linen)] placeholder-[var(--color-clay)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
        <button
          onClick={onZoomReset}
          title="Reset zoom"
          className="px-2 py-1.5 text-xs text-[var(--color-clay)] border border-[var(--color-stone)] rounded hover:border-[var(--color-clay)] transition-colors"
        >
          ⊡ Reset
        </button>
      </div>

      {/* Scale filter pills */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-xs text-[var(--color-clay)] mr-1">Scale:</span>
        {ALL_SCALES.map(scale => {
          const active = activeScales.has(scale);
          return (
            <button
              key={scale}
              onClick={() => toggleScale(scale)}
              style={active ? { backgroundColor: SCALE_COLORS[scale] + '33', borderColor: SCALE_COLORS[scale], color: SCALE_COLORS[scale] } : {}}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                active
                  ? ''
                  : 'border-[var(--color-stone)] text-[var(--color-stone)] hover:border-[var(--color-clay)] hover:text-[var(--color-clay)]'
              }`}
            >
              {SCALE_LABELS[scale as ScaleLevel]}
            </button>
          );
        })}
        {activeScales.size < ALL_SCALES.length && (
          <button
            onClick={clearScaleFilter}
            className="px-2 py-0.5 text-xs text-[var(--color-clay)] hover:text-[var(--color-sand)] transition-colors"
          >
            Show all
          </button>
        )}
      </div>
    </div>
  );
}
