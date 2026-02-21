import { useRef, useCallback } from 'react';
import { GraphCanvas } from './GraphCanvas';
import { GraphControls } from './GraphControls';
import { PatternDetail } from './PatternDetail';
import { usePatternStore } from '../../store/usePatternStore';
import { useExplorerStore } from '../../store/useExplorerStore';

export function PatternExplorer() {
  const { loading, error } = usePatternStore();
  const { selectedPatternId } = useExplorerStore();
  const zoomResetRef = useRef<() => void>(() => {});

  const handleZoomResetRegister = useCallback((fn: () => void) => {
    zoomResetRef.current = fn;
  }, []);

  const handleZoomReset = useCallback(() => {
    zoomResetRef.current?.();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-clay)]">
        <div className="text-center">
          <p className="text-lg mb-2">Failed to load patterns</p>
          <p className="text-sm opacity-60">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <GraphControls onZoomReset={handleZoomReset} />

      <div className="flex flex-1 min-h-0">
        {/* Graph canvas */}
        <div className="flex-1 min-w-0 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-soil)] z-10">
              <div className="text-center text-[var(--color-clay)]">
                <div className="text-3xl mb-3 animate-pulse">◉</div>
                <p className="text-sm">Loading 253 patterns…</p>
              </div>
            </div>
          )}
          <GraphCanvas onZoomReset={handleZoomResetRegister} />
        </div>

        {/* Detail panel */}
        <div
          className={`flex-shrink-0 border-l border-[var(--color-stone)] bg-[var(--color-bark)] overflow-hidden transition-all duration-300 ${
            selectedPatternId ? 'w-80' : 'w-64'
          }`}
        >
          <PatternDetail />
        </div>
      </div>
    </div>
  );
}
