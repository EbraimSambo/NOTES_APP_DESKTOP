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
import { ptBR } from 'date-fns/locale';
import { useNoteEditor } from '@/hooks/notes/useNoteEditor.Hook';
import { useDebounce } from 'use-debounce';

export function NoteEditor() {
  const { selectedNote, updateNote, deleteNote, togglePin, clearSelectedNote } = useNoteEditor();
  
  if (!selectedNote) return null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(selectedNote.title);
  const [content, setContent] = useState(selectedNote.content);

  useEffect(() => {
    setTitle(selectedNote.title);
    setContent(selectedNote.content);
  }, [selectedNote]);

  const [debouncedTitle] = useDebounce(title, 500);
  const [debouncedContent] = useDebounce(content, 500);

  useEffect(() => {
    if (debouncedTitle !== selectedNote.title) {
      updateNote(selectedNote.id, { title: debouncedTitle });
    }
  }, [debouncedTitle, selectedNote.id, selectedNote.title, updateNote]);

  useEffect(() => {
    if (debouncedContent !== selectedNote.content) {
      updateNote(selectedNote.id, { content: debouncedContent });
    }
  }, [debouncedContent, selectedNote.id, selectedNote.content, updateNote]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  
  const handleDelete = () => {
    deleteNote(selectedNote.id);
    clearSelectedNote();
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
            <span>{format(selectedNote.createdAt, 'MMM d, yyyy', { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconClock className="w-3.5 h-3.5" />
            <span>Editar {format(selectedNote.updatedAt, 'MMM d, yyyy', { locale: ptBR })}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => togglePin(selectedNote.id)}
            className={`p-2 rounded-lg transition-colors ${
              selectedNote.isPinned
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-accent text-muted-foreground'
            }`}
          >
            {selectedNote.isPinned ? (
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
            onClick={() => handleDelete()}
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
            <h1 className="text-3xl font-bold mb-6">{selectedNote.title || 'Sem título'}</h1>
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedNote.content || '*Ainda não há conteúdo. Clique em editar para começar a escrever.*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {selectedNote.tags && selectedNote.tags.length > 0 && (
        <div className="p-4 border-t border-border/50 flex items-center gap-2">
          {selectedNote.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
