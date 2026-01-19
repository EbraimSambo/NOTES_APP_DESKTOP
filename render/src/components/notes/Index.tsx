"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotesList } from '@/components/notes/NotesList';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { CreateNoteModal } from '@/components/notes/CreateNoteModal';
import { EmptyState } from './EmptyState';
import { useGetNotes } from '@/hooks/notes/useGetNotes.Hook';
import { Skeleton } from '@/components/ui/skeleton';
import { useNoteActions } from '@/hooks/notes/useNoteActions.Hook';
import { useUIState } from '@/hooks/notes/useUIState.Hook';

const Index = () => {
  const { 
    selectedNote, 
    activeFilter, 
    filteredPinned, 
    filteredUnpinned, 
    totalCount,
    openCreateModal,
    selectNote,
    setFilter
  } = useUIState();
  const { loading, reorderNotes, hasMore, loadingMore, loadMore } = useGetNotes({ 
    isPinned: activeFilter === 'pinned', 
    isDeleted: activeFilter === 'trash' 
  });
  const { togglePin, restoreNote } = useNoteActions();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        onNewNote={openCreateModal}
        activeFilter={activeFilter}
        onFilterChange={setFilter}
        notesCount={totalCount}
      />

      {/* Notes List Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-80 h-screen border-r border-border/50 flex flex-col bg-card/30"
      >
        <header className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">
            {activeFilter === 'pinned' ? 'Anotações fixadas' : 
             activeFilter === 'trash' ? 'Lixeira' : 'Todas as notas'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'nota' : 'notas'}
          </p>
        </header>
        {loading && (
          <div className="space-y-4 p-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className='h-18 bg-gray-50/15 border w-full' />
            ))}
          </div>
        )}
        {!loading && <NotesList
          pinnedNotes={filteredPinned}
          unpinnedNotes={filteredUnpinned}
          selectedNote={selectedNote}
          onSelectNote={selectNote}
          onTogglePin={togglePin}
          onReorder={reorderNotes}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={loadMore}
          onRestore={activeFilter === 'trash' ? restoreNote : undefined}
        />}
      </motion.div>

      {/* Editor/Viewer Panel */}
      <div className="flex-1 bg-background">
        {selectedNote ? (
          <NoteEditor />
        ) : (
          <EmptyState onNewNote={openCreateModal} />
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal />
    </div>
  );
};

export default Index;
