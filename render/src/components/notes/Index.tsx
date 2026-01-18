"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotesList } from '@/components/notes/NotesList';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { CreateNoteModal } from '@/components/notes/CreateNoteModal';
import { EmptyState } from './EmptyState';
import { useNotes } from '@/hooks/notes/useNotes.hook';
import { useGetNotes } from '@/hooks/notes/useGetNotes.Hook';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateNote } from '@/hooks/notes/useCreateNote.Hook';
const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const {
    pinnedNotes,
    unpinnedNotes,
    selectedNote,
    setSelectedNote,
    updateNote,
    deleteNote,
    togglePin,
    reorderNotes,
  } = useNotes();
  const { notes, loading, error,refetch } = useGetNotes({})
  const {note, submitCreateNote, loading: createLoading, error: createError} = useCreateNote();
  const filteredPinned = activeFilter === 'pinned' ? pinnedNotes : pinnedNotes;
  const filteredUnpinned = activeFilter === 'pinned' ? [] : unpinnedNotes;
  const totalCount = filteredPinned.length + filteredUnpinned.length;

  React.useEffect(() => {
    if (note) {
      refetch();
    }
  }, [note, refetch]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        onNewNote={() => setIsCreateModalOpen(true)}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        notesCount={notes.length}
      />

      {/* Notes List Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-80 h-screen border-r border-border/50 flex flex-col bg-card/30"
      >
        <header className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold text-foreground">
            {activeFilter === 'pinned' ? 'Anotações fixadas' : 'Todas as notas'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'note' : 'notes'}
          </p>
        </header>
        {loading && (
          <div className="">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className='h-20' />
            ))}
          </div>
        )}
        {notes && notes.length > 0 && <NotesList
          pinnedNotes={filteredPinned}
          unpinnedNotes={filteredUnpinned}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onTogglePin={togglePin}
          onReorder={reorderNotes}
        />}
      </motion.div>

      {/* Editor/Viewer Panel */}
      <div className="flex-1 bg-background">
        {selectedNote ? (
          <NoteEditor
            note={selectedNote}
            onUpdate={updateNote}
            onDelete={(id) => {
              deleteNote(id);
              setSelectedNote(null);
            }}
            onTogglePin={togglePin}
          />
        ) : (
          <EmptyState onNewNote={() => setIsCreateModalOpen(true)} />
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={submitCreateNote}
        isLoading={createLoading}
      />
    </div>
  );
};

export default Index;
