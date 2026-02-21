import { useJournalStore } from '../../store/useJournalStore';
import { EntryList } from './EntryList';
import { EntryEditor } from './EntryEditor';

export function PatternJournal() {
  const { setActiveEntryId } = useJournalStore();

  const handleNewEntry = () => {
    setActiveEntryId(null); // Clear active entry → editor shows blank form
  };

  return (
    <div className="flex h-full">
      <EntryList onNewEntry={handleNewEntry} />
      <div className="flex-1 min-w-0 overflow-hidden">
        <EntryEditor />
      </div>
    </div>
  );
}
