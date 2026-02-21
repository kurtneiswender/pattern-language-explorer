import { useRef } from 'react';
import { PatternSelector } from './PatternSelector';
import { IsometricCanvas } from './IsometricCanvas';
import { SceneControls } from './SceneControls';

export function DiagramStudio() {
  const svgExportRef = useRef<(() => void) | null>(null);

  const handleExportRegister = (fn: () => void) => {
    svgExportRef.current = fn;
  };

  const handleExport = () => {
    svgExportRef.current?.();
  };

  return (
    <div className="flex flex-col h-full">
      <SceneControls onExportSvg={handleExport} />
      <div className="flex flex-1 min-h-0">
        <PatternSelector />
        <div className="flex-1 min-w-0">
          <IsometricCanvas onExportSvg={handleExportRegister} />
        </div>
      </div>
    </div>
  );
}
