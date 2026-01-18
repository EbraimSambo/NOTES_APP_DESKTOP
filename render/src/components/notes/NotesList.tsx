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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
          <IconNotebook className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma anotação</h3>
        <p className="text-sm text-muted-foreground">
          Crie sua primeira anotação para começar.
        </p>
      </div>
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
        <AnimatePresence mode="popLayout">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                Anotações fixadas
              </h2>
              <SortableContext
                items={pinnedNotes.map((n) => n.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {pinnedNotes.map((note) => (
                    <SortableNoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onClick={() => onSelectNote(note)}
                      onTogglePin={() => onTogglePin(note.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </motion.section>
          )}

          {/* Other Notes */}
          {unpinnedNotes.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {pinnedNotes.length > 0 && (
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                  Anotações
                </h2>
              )}
              <SortableContext
                items={unpinnedNotes.map((n) => n.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-3">
                  {unpinnedNotes.map((note) => (
                    <SortableNoteCard
                      key={note.id}
                      note={note}
                      isSelected={selectedNote?.id === note.id}
                      onClick={() => onSelectNote(note)}
                      onTogglePin={() => onTogglePin(note.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </motion.section>
          )}
          
          {/* Loading More Indicator */}
          {hasMore && (
            <div 
              ref={ref}
              className="flex justify-center py-4"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Carregando mais notas...
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Role para carregar mais
                </div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeNote ? (
            <div className="opacity-90 rotate-2 scale-105">
              <NoteCard
                note={activeNote}
                isSelected={false}
                onClick={() => {}}
                onTogglePin={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
