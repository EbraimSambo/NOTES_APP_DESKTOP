import { motion } from 'framer-motion';
import { IconPin, IconPinFilled, IconDots } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Note } from '@/types/notes.core';
import { ptBR } from 'date-fns/locale';
interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onTogglePin: () => void;
}

export function NoteCard({ note, isSelected, onClick, onTogglePin }: NoteCardProps) {
  const getPreview = (content: string) => {
    // Strip markdown and get first 100 chars
    return content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/>\s/g, '')
      .replace(/- \[.\]\s/g, '')
      .slice(0, 100)
      .trim() + (content.length > 100 ? '...' : '');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'glass-strong ring-2 ring-primary/50 shadow-glow'
          : 'glass hover:glass-strong'
      }`}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-1 -right-1 w-6 h-6 gradient-primary rounded-full flex items-center justify-center shadow-glow">
          <IconPinFilled className="w-3 h-3 text-primary-foreground" />
        </div>
      )}

      {/* Actions */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          {note.isPinned ? (
            <IconPinFilled className="w-4 h-4 text-primary" />
          ) : (
            <IconPin className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
          <IconDots className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <h3 className="font-semibold text-foreground mb-2 pr-16 line-clamp-1">
        {note.title || 'Sem título'}
      </h3>
      {note.content && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {getPreview(note.content)}
      </p>}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(note.updatedAt, { addSuffix: true, locale: ptBR })}
        </span>
        {note.tags && note.tags.length > 0 && (
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
