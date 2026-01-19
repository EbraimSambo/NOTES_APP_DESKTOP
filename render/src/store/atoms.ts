import { atom } from 'jotai';
import { Note } from '@/types/notes.core';

// Átomo principal para armazenar todas as notas
export const notesAtom = atom<Note[]>([]);

// Átomo para paginação
export const paginationAtom = atom({
  page: 1,
  limit: 10,
  hasMore: true,
  totalCount: 0
});

// Átomo para estado de loading
export const notesLoadingAtom = atom<boolean>(true);

// Átomo para loading de mais notas (scroll infinito)
export const loadingMoreAtom = atom<boolean>(false);

// Átomo para erros
export const notesErrorAtom = atom<string | null>(null);

// Átomo para a nota selecionada atualmente
export const selectedNoteAtom = atom<Note | null>(null);

// Átomo para o filtro ativo
export const activeFilterAtom = atom<"all" | "pinned" | "deleted" | "trash">('all');

// Átomo para controlar se o modal de criação está aberto
export const createModalOpenAtom = atom<boolean>(false);

// Átomo para loading de criação de nota
export const createLoadingAtom = atom<boolean>(false);

// Átomo para erros de criação
export const createErrorAtom = atom<string | null>(null);

// Átomo derivado para notas fixadas
export const pinnedNotesAtom = atom(
  (get) => get(notesAtom).filter(note => (note.isPinned ?? false) && !note.deletedAt)
);

// Átomo derivado para notas não fixadas
export const unpinnedNotesAtom = atom(
  (get) => get(notesAtom).filter(note => !note.isPinned && !note.deletedAt)
);

// Átomo derivado para notas excluídas
export const deletedNotesAtom = atom(
  (get) => get(notesAtom).filter(note => note.deletedAt)
);

// Átomo derivado para notas filtradas
export const filteredNotesAtom = atom(
  (get) => {
    const activeFilter = get(activeFilterAtom);
    const pinnedNotes = get(pinnedNotesAtom);
    const unpinnedNotes = get(unpinnedNotesAtom);
    const deletedNotes = get(deletedNotesAtom);
    
    if (activeFilter === 'trash') {
      return {
        pinned: [],
        unpinned: deletedNotes,
        totalCount: deletedNotes.length
      };
    }
    
    const filteredPinned = activeFilter === 'pinned' ? pinnedNotes : pinnedNotes;
    const filteredUnpinned = activeFilter === 'pinned' ? [] : unpinnedNotes;
    
    return {
      pinned: filteredPinned,
      unpinned: filteredUnpinned,
      totalCount: filteredPinned.length + filteredUnpinned.length
    };
  }
);
