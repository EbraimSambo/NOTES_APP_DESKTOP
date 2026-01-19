import { useState, useEffect, useRef } from 'react';
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
  IconRestore,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNoteEditor } from '@/hooks/notes/useNoteEditor.Hook';
import { useDebounce } from 'use-debounce';

export function NoteEditor() {
  const { selectedNote, updateNote, deleteNote, togglePin, restoreNote, clearSelectedNote } = useNoteEditor();
  
  if (!selectedNote) return null;
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(selectedNote.title);
  const [content, setContent] = useState(selectedNote.content);

  // Ref para armazenar valores iniciais da nota selecionada
  const initialValuesRef = useRef({ title: selectedNote.title, content: selectedNote.content });
  
  // Atualizar valores quando a nota selecionada mudar
  useEffect(() => {
    setTitle(selectedNote.title);
    setContent(selectedNote.content);
    initialValuesRef.current = { title: selectedNote.title, content: selectedNote.content };
  }, [selectedNote.id]); // Apenas quando o ID da nota mudar

  const [debouncedTitle] = useDebounce(title, 1000);
  const [debouncedContent] = useDebounce(content, 1000);
  
  // Ref para rastrear se há uma atualização em andamento
  const isUpdatingRef = useRef(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Efeito para salvar automaticamente com debounce
  useEffect(() => {
    // Se já está atualizando, ignorar
    if (isUpdatingRef.current) return;
    
    // Verificar se houve mudanças reais comparando com os valores iniciais
    const hasTitleChanged = debouncedTitle !== initialValuesRef.current.title && debouncedTitle.trim() !== '';
    const hasContentChanged = debouncedContent !== initialValuesRef.current.content;
    
    if (!hasTitleChanged && !hasContentChanged) return;
    
    // Marcar como atualizando
    isUpdatingRef.current = true;
    
    const updates: any = {};
    if (hasTitleChanged) updates.title = debouncedTitle;
    if (hasContentChanged) updates.content = debouncedContent;
    
    updateNote(selectedNote.id, updates)
      .then(() => {
        // Atualizar os valores iniciais após sucesso
        if (hasTitleChanged) initialValuesRef.current.title = debouncedTitle;
        if (hasContentChanged) initialValuesRef.current.content = debouncedContent;
      })
      .catch((error) => {
        console.error('Update failed:', error);
        // Reverter para valores anteriores em caso de erro
        setTitle(initialValuesRef.current.title);
        setContent(initialValuesRef.current.content);
      })
      .finally(() => {
        // Aguardar um pouco antes de permitir nova atualização
        updateTimeoutRef.current = setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      });
  }, [debouncedTitle, debouncedContent, selectedNote.id, updateNote]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      isUpdatingRef.current = false;
    };
  }, []);

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

  const handleRestore = () => {
    restoreNote(selectedNote.id);
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
            onClick={() => selectedNote.deletedAt ? handleRestore() : handleDelete()}
            className={`p-2 rounded-lg transition-colors ${
              selectedNote.deletedAt 
                ? 'hover:bg-green-500/10 text-green-600 hover:text-green-600' 
                : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
            }`}
          >
            {selectedNote.deletedAt ? (
              <IconRestore className="w-5 h-5" />
            ) : (
              <IconTrash className="w-5 h-5" />
            )}
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