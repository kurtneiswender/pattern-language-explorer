import { useDiagramStore } from '../../store/useDiagramStore';

interface SceneControlsProps {
  onExportSvg: () => void;
}

export function SceneControls({ onExportSvg }: SceneControlsProps) {
  const { blocks, clearBlocks } = useDiagramStore();

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-bark)] border-b border-[var(--color-stone)]">
      <div className="text-xs text-[var(--color-clay)]">
        {blocks.length === 0 ? 'Empty scene' : `${blocks.length} block${blocks.length !== 1 ? 's' : ''}`}
      </div>
      <div className="flex gap-2">
        {blocks.length > 0 && (
          <button
            onClick={clearBlocks}
            className="px-2.5 py-1 text-xs text-[var(--color-clay)] border border-[var(--color-stone)] rounded hover:border-red-500 hover:text-red-400 transition-colors"
          >
            Clear Scene
          </button>
        )}
        <button
          onClick={onExportSvg}
          disabled={blocks.length === 0}
          className="px-2.5 py-1 text-xs text-[var(--color-clay)] border border-[var(--color-stone)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Export SVG
        </button>
      </div>
    </div>
  );
}
