"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { NotesList } from '@/components/notes/NotesList';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { CreateNoteModal } from '@/components/notes/CreateNoteModal';
import { EmptyState } from './EmptyState';
import { useNotes } from '@/hooks/notes/useNotes.hook';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const {
    notes,
    pinnedNotes,
    unpinnedNotes,
    selectedNote,
    setSelectedNote,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    reorderNotes,
  } = useNotes();

  const filteredPinned = activeFilter === 'pinned' ? pinnedNotes : pinnedNotes;
  const filteredUnpinned = activeFilter === 'pinned' ? [] : unpinnedNotes;
  const totalCount = filteredPinned.length + filteredUnpinned.length;

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
        <NotesList
          pinnedNotes={filteredPinned}
          unpinnedNotes={filteredUnpinned}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onTogglePin={togglePin}
          onReorder={reorderNotes}
        />
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
        onCreate={createNote}
      />
    </div>
  );
};

export default Index;
