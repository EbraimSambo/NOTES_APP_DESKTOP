import { useAtom } from 'jotai';
import { selectedNoteAtom, activeFilterAtom, createModalOpenAtom, filteredNotesAtom, searchQueryAtom } from '@/store/atoms';

export function useUIState() {
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const [activeFilter, setActiveFilter] = useAtom(activeFilterAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useAtom(createModalOpenAtom);
  const { pinned: filteredPinned, unpinned: filteredUnpinned, totalCount } = useAtom(filteredNotesAtom)[0];

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const selectNote = (note: any) => setSelectedNote(note);
  const clearSelectedNote = () => setSelectedNote(null);
  const setFilter = (filter: "all" | "pinned" | "deleted" | "trash") => setActiveFilter(filter);

  return {
    // Estado
    selectedNote,
    activeFilter,
    searchQuery,
    isCreateModalOpen,
    filteredPinned,
    filteredUnpinned,
    totalCount,
    
    // Ações
    openCreateModal,
    closeCreateModal,
    selectNote,
    clearSelectedNote,
    setFilter,
    setSearchQuery,
    setSelectedNote
  };
}
