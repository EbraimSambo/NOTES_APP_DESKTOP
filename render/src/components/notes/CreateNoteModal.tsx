import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconX, IconHash } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Note, Tag } from '@/types/notes.core';
import { CreateNote } from '@/actions/create-notes';
import { useCreateModal } from '@/hooks/notes/useCreateModal.Hook';

export function CreateNoteModal() {
  const { isModalOpen, createLoading, submitCreateNote, closeModal } = useCreateModal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCreate = async () => {
    try {
      await submitCreateNote({
        note: {
          title: title || 'Sem título',
          content,
          tags: tags.map(tag => ({ id: '', name: tag })),
        }
      });
      setTitle('');
      setContent('');
      setTags([]);
      closeModal();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-2xl glass-strong border-border/50 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="sr-only">Criar nova nota</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          {/* Title */}
          <div className="px-6 pt-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da nota..."
              className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sua nota em Markdown..."
              rows={12}
              className="w-full bg-transparent border-none outline-none resize-none text-foreground/90 placeholder:text-muted-foreground/50 font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="px-6 py-4 border-t border-border/50">
            <div className="flex items-center gap-2 flex-wrap">
              <IconHash className="w-4 h-4 text-muted-foreground" />
              {tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-primary/70"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar tag..."
                className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border/50 bg-muted/20">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <motion.button
              onClick={handleCreate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 text-sm font-medium gradient-primary text-primary-foreground rounded-lg shadow-glow"
            >
              {createLoading ? 'Criando...' : 'Criar Nota'}
            </motion.button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
