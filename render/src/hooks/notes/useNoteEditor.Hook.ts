import { useAtom } from 'jotai';
import { selectedNoteAtom } from '@/store/atoms';
import { useNoteActions } from '@/hooks/notes/useNoteActions.Hook';

export function useNoteEditor() {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const { updateNote, deleteNote, togglePin } = useNoteActions();
  
  if (!selectedNote) {
    return {
      selectedNote: null,
      updateNote,
      deleteNote,
      togglePin,
      clearSelectedNote: () => {}
    };
  }

  const clearSelectedNote = () => setSelectedNote(null);

  return {
    selectedNote,
    updateNote,
    deleteNote,
    togglePin,
    clearSelectedNote
  };
}
