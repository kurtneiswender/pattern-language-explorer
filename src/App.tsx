import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { PatternExplorer } from './components/explorer/PatternExplorer';
import { DiagramStudio } from './components/diagram/DiagramStudio';
import { PatternJournal } from './components/journal/PatternJournal';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/explorer" replace />} />
        <Route path="explorer" element={<PatternExplorer />} />
        <Route path="diagram" element={<DiagramStudio />} />
        <Route path="journal" element={<PatternJournal />} />
      </Route>
    </Routes>
  );
}
