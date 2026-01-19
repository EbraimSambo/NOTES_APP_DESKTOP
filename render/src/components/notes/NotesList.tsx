import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { SortableNoteCard } from './SortableNoteCard';
import { IconNotebook, IconLoader2 } from '@tabler/icons-react';
import { Note } from '@/types/notes.core';
import { NoteCard } from './NotesCard';
import { useInfiniteScroll } from '@/hooks/notes/useInfiniteScroll.Hook';

interface NotesListProps {
  pinnedNotes: Note[];
  unpinnedNotes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onTogglePin: (id: string) => void;
  onReorder: (activeId: string, overId: string) => void;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export function NotesList({
  pinnedNotes,
  unpinnedNotes,
  selectedNote,
  onSelectNote,
  onTogglePin,
  onReorder,
  hasMore,
  loadingMore,
  onLoadMore,
}: NotesListProps) {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const { ref } = useInfiniteScroll({
    hasMore,
    loadingMore,
    onLoadMore,
    threshold: 0.1
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const allNotes = [...pinnedNotes, ...unpinnedNotes];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const note = allNotes.find((n) => n.id === active.id);
    setActiveNote(note || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNote(null);

    if (over && active.id !== over.id) {
      onReorder(active.id as string, over.id as string);
    }
  };

  if (allNotes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full p-8 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <IconNotebook className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma anotação</h3>
        <p className="text-sm text-muted-foreground">
          Crie sua primeira anotação para começar.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 space-y-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
              Anotações fixadas
            </h2>
            <SortableContext
              items={pinnedNotes.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <div className="grid gap-3">
                  {pinnedNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 1
                      }}
                    >
                      <SortableNoteCard
                        note={note}
                        isSelected={selectedNote?.id === note.id}
                        onClick={() => onSelectNote(note)}
                        onTogglePin={() => onTogglePin(note.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </SortableContext>
          </section>
        )}

        {/* Other Notes */}
        {unpinnedNotes.length > 0 && (
          <section className="space-y-3">
            {pinnedNotes.length > 0 && (
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                Anotações
              </h2>
            )}
            <SortableContext
              items={unpinnedNotes.map((n) => n.id)}
              strategy={verticalListSortingStrategy}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <div className="grid gap-3">
                  {unpinnedNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 1
                      }}
                    >
                      <SortableNoteCard
                        note={note}
                        isSelected={selectedNote?.id === note.id}
                        onClick={() => onSelectNote(note)}
                        onTogglePin={() => onTogglePin(note.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </SortableContext>
          </section>
        )}
        
        {/* Loading More Indicator */}
        {hasMore && (
          <motion.div 
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-4"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconLoader2 className="w-4 h-4 animate-spin" />
                Carregando mais notas...
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Não ha mais notas para carregar
              </div>
            )}
          </motion.div>
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {activeNote ? (
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: 1.05, rotate: 2 }}
              className="opacity-90"
            >
              <NoteCard
                note={activeNote}
                isSelected={false}
                onClick={() => {}}
                onTogglePin={() => {}}
              />
            </motion.div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}