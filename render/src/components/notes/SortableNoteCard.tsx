import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Note } from '@/types/notes.core';
import { NoteCard } from './NotesCard';

interface SortableNoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onTogglePin: () => void;
  onRestore?: () => void;
}

export function SortableNoteCard({ note, isSelected, onClick, onTogglePin, onRestore }: SortableNoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <NoteCard
        note={note}
        isSelected={isSelected}
        onClick={onClick}
        onTogglePin={onTogglePin}
        onRestore={onRestore}
      />
    </div>
  );
}
