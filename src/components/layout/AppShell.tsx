import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { usePatterns } from '../../hooks/usePatterns';

export function AppShell() {
  // Load patterns once at app level
  usePatterns();

  return (
    <div className="flex flex-col h-full bg-[var(--color-soil)]">
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-[var(--color-bark)] border-b border-[var(--color-stone)]">
        <div className="flex items-center gap-3">
          <span className="text-[var(--color-accent)] text-xl">◉</span>
          <div>
            <h1 className="font-['DM_Serif_Display'] text-lg leading-tight text-[var(--color-linen)]">
              Pattern Language
            </h1>
            <p className="text-xs text-[var(--color-clay)] leading-tight">
              Christopher Alexander · 253 patterns
            </p>
          </div>
        </div>
        <a
          href="/tools"
          className="text-xs text-[var(--color-clay)] hover:text-[var(--color-sand)] transition-colors"
        >
          ← All Tools
        </a>
      </header>

      <div className="flex-shrink-0 bg-[var(--color-bark)]">
        <TabBar />
      </div>

      <main className="flex-1 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
