import { useState, useEffect } from 'react';
import { useJournalStore } from '../../store/useJournalStore';
import { PatternTag } from './PatternTag';
import { AIAssistant } from './AIAssistant';

export function EntryEditor() {
  const { activeEntryId, entries, updateEntry, addEntry, setActiveEntryId } = useJournalStore();

  const activeEntry = entries.find(e => e.id === activeEntryId);

  const [title, setTitle] = useState('');
  const [observation, setObservation] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (activeEntry) {
      setTitle(activeEntry.title);
      setObservation(activeEntry.observation);
      setLocation(activeEntry.location || '');
    } else {
      setTitle('');
      setObservation('');
      setLocation('');
    }
  }, [activeEntryId]);

  const handleSave = () => {
    if (!title.trim() && !observation.trim()) return;
    if (activeEntryId && activeEntry) {
      updateEntry(activeEntryId, { title, observation, location });
    } else {
      addEntry({ title, observation, location, taggedPatterns: [] });
    }
  };

  const handleAddTag = (patternId: number) => {
    if (!activeEntryId) {
      // Create entry first
      const newId = addEntry({ title, observation, location, taggedPatterns: [patternId] });
      setActiveEntryId(newId);
    } else {
      const current = activeEntry?.taggedPatterns || [];
      if (!current.includes(patternId)) {
        updateEntry(activeEntryId, { taggedPatterns: [...current, patternId] });
      }
    }
  };

  const handleRemoveTag = (patternId: number) => {
    if (!activeEntryId) return;
    const current = activeEntry?.taggedPatterns || [];
    updateEntry(activeEntryId, { taggedPatterns: current.filter(id => id !== patternId) });
  };

  const taggedPatterns = activeEntry?.taggedPatterns || [];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
      {/* Title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleSave}
          placeholder="Entry title…"
          className="w-full bg-transparent text-lg font-['DM_Serif_Display'] text-[var(--color-linen)] placeholder-[var(--color-stone)] focus:outline-none border-b border-[var(--color-stone)] focus:border-[var(--color-clay)] pb-1 transition-colors"
        />
      </div>

      {/* Location */}
      <div>
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          onBlur={handleSave}
          placeholder="Location (optional)…"
          className="w-full bg-transparent text-xs text-[var(--color-clay)] placeholder-[var(--color-stone)] focus:outline-none"
        />
      </div>

      {/* Observation */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-[var(--color-clay)] mb-2">
          Observation
        </label>
        <textarea
          value={observation}
          onChange={e => setObservation(e.target.value)}
          onBlur={handleSave}
          placeholder="Describe what you observe in this place — qualities of space, human activity, built elements, light, scale…"
          rows={6}
          className="w-full bg-[var(--color-soil)] border border-[var(--color-stone)] rounded p-2.5 text-sm text-[var(--color-linen)] placeholder-[var(--color-clay)] focus:outline-none focus:border-[var(--color-clay)] resize-none leading-relaxed"
        />
      </div>

      {/* Pattern tags */}
      <div>
        <label className="block text-xs font-medium uppercase tracking-widest text-[var(--color-clay)] mb-2">
          Tagged Patterns
        </label>
        <PatternTag
          taggedPatterns={taggedPatterns}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
        />
      </div>

      {/* AI Assistant */}
      <AIAssistant
        observation={observation}
        onAddPattern={handleAddTag}
      />

      {/* Save button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={!title.trim() && !observation.trim()}
          className="px-4 py-1.5 text-xs bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Save Entry
        </button>
      </div>
    </div>
  );
}
