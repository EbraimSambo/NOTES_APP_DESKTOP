import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  IconEdit, 
  IconEye, 
  IconTrash, 
  IconPin, 
  IconPinFilled,
  IconCalendar,
  IconClock,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { Note } from '@/types/notes.core';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function NoteEditor({ note, onUpdate, onDelete, onTogglePin }: NoteEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    onUpdate(note.id, { title, content });
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate(note.id, { title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate(note.id, { content: newContent });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 h-screen flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/50 glass">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconCalendar className="w-3.5 h-3.5" />
            <span>{format(note.createdAt, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconClock className="w-3.5 h-3.5" />
            <span>Editar {format(note.updatedAt, 'MMM d, yyyy')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-2 rounded-lg transition-colors ${
              note.isPinned
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent text-muted-foreground'
            }`}
          >
            {note.isPinned ? (
              <IconPinFilled className="w-5 h-5" />
            ) : (
              <IconPin className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg transition-colors ${
              isEditing
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent text-muted-foreground'
            }`}
          >
            {isEditing ? (
              <IconEye className="w-5 h-5" />
            ) : (
              <IconEdit className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <IconTrash className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <div className="h-full flex flex-col p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Note title..."
              className="text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-6"
            />
            <textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your note in Markdown..."
              className="flex-1 bg-transparent border-none outline-none resize-none text-foreground/90 placeholder:text-muted-foreground/50 font-mono text-sm leading-relaxed"
            />
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">{note.title || 'Untitled'}</h1>
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content || '*No content yet. Click edit to start writing.*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="p-4 border-t border-border/50 flex items-center gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
