import { motion } from 'framer-motion';
import { IconNotebook, IconSparkles } from '@tabler/icons-react';

interface EmptyStateProps {
  onNewNote: () => void;
}

export function EmptyState({ onNewNote }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center p-8 h-full"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center border border-border/50">
          <IconNotebook className="w-16 h-16 text-muted-foreground" />
        </div>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="absolute -top-2 -right-2 w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow"
        >
          <IconSparkles className="w-5 h-5 text-primary-foreground" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-foreground mb-3"
      >
        Select a note
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-center max-w-md mb-8"
      >
        Choose a note from the list to view or edit, or create a new one to get started.
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNewNote}
        className="px-8 py-3 gradient-primary rounded-xl text-primary-foreground font-medium shadow-glow hover:opacity-90 transition-opacity"
      >
        Create New Note
      </motion.button>
    </motion.div>
  );
}
