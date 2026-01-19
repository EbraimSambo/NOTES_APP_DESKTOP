import { motion } from 'framer-motion';
import { 
  IconNotes, 
  IconSearch, 
  IconPlus,
  IconStar,
  IconFolder,
  IconTag,
  IconTrash,
  IconSettings,
} from '@tabler/icons-react';

interface SidebarProps {
  onNewNote: () => void;
  activeFilter: "all" | "pinned" | "deleted" | "trash";
  onFilterChange: (filter: "all" | "pinned" | "deleted" | "trash") => void;
  notesCount: number;
}

const menuItems = [
  { id: 'all' as const, icon: IconNotes, label: 'Todas as Notas' },
  { id: 'pinned' as const, icon: IconStar, label: 'Fixadas' },
  { id: 'trash' as const, icon: IconTrash, label: 'Lixeira' },
];

export function Sidebar({ onNewNote, activeFilter, onFilterChange, notesCount }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen glass-strong flex flex-col border-r border-border/50"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <IconNotes className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">Notas</h1>
            <p className="text-xs text-muted-foreground">{notesCount} notas</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Procurar por notas..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* New Note Button */}
      <div className="px-4 mb-2">
        <motion.button
          onClick={onNewNote}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 gradient-primary rounded-lg text-primary-foreground font-medium shadow-glow transition-all hover:opacity-90"
        >
          <IconPlus className="w-5 h-5" />
          <span>Nova Nota</span>
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => onFilterChange(item.id)}
            whileHover={{ x: 4 }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
              activeFilter === item.id
                ? 'bg-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border/50">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
          <IconSettings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </motion.aside>
  );
}
