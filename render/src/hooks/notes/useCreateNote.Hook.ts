import { CreateNote, createNote } from "@/actions/create-notes";
import { useAtom } from 'jotai';
import { notesAtom, createLoadingAtom, createErrorAtom, paginationAtom } from '@/store/atoms';
import { useCallback } from 'react';

export function useCreateNote() {
  const [notes, setNotes] = useAtom(notesAtom);
  const [loading, setLoading] = useAtom(createLoadingAtom);
  const [error, setError] = useAtom(createErrorAtom);
  const [, setPagination] = useAtom(paginationAtom);

  const submitCreateNote = useCallback(async (note: CreateNote) => {
    setLoading(true);
    setError(null);

    try {
      const newNote = await createNote(note);
      
      // Adicionar nota com animação suave
      setNotes(prevNotes => {
        // Se a nota for pinned, adicionar no início das pinned
        // Se não, adicionar no início das unpinned
        if (newNote.isPinned) {
          return [newNote, ...prevNotes];
        } else {
          // Encontrar o índice onde as notas não pinned começam
          const firstUnpinnedIndex = prevNotes.findIndex(n => !n.isPinned);
          if (firstUnpinnedIndex === -1) {
            // Todas são pinned, adicionar no final
            return [...prevNotes, newNote];
          }
          // Inserir no início das não pinned
          return [
            ...prevNotes.slice(0, firstUnpinnedIndex),
            newNote,
            ...prevNotes.slice(firstUnpinnedIndex)
          ];
        }
      });

      // Atualizar paginação
      setPagination(prev => ({
        ...prev,
        totalCount: prev.totalCount + 1
      }));

      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setNotes, setPagination, setLoading, setError]);

  return {
    submitCreateNote,
    loading,
    error
  };
}