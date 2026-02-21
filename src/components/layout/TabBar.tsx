import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/explorer', label: 'Explorer', icon: '◎' },
  { to: '/diagram',  label: 'Diagram',  icon: '⬡' },
  { to: '/journal',  label: 'Journal',  icon: '◈' },
];

export function TabBar() {
  return (
    <nav className="flex border-b border-[var(--color-stone)]">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-wide transition-colors duration-150 border-b-2 -mb-px ${
              isActive
                ? 'border-[var(--color-accent)] text-[var(--color-linen)]'
                : 'border-transparent text-[var(--color-clay)] hover:text-[var(--color-sand)] hover:border-[var(--color-stone)]'
            }`
          }
        >
          <span className="text-base leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
