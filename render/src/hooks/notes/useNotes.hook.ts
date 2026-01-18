import { Note } from '@/types/notes.core';
import { useState } from 'react';

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: `# Welcome to your Notes App! 🎉

This is a **beautiful** note-taking application built with modern technologies.

## Features
- ✨ Clean, dark interface
- 📝 Markdown support
- 🎨 Multiple note colors
- 📌 Pin important notes

## Getting Started
Click the **+ New Note** button to create your first note!

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> "The best way to predict the future is to create it." - Peter Drucker
`,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isPinned: true,
    tags: ['welcome', 'tutorial'],
  },
  {
    id: '2',
    title: 'Project Ideas',
    content: `# Project Ideas

## Web Development
- [ ] Personal portfolio redesign
- [ ] Blog with MDX support
- [ ] SaaS dashboard template

## Mobile Apps
- [ ] Habit tracker
- [ ] Expense manager
- [ ] Recipe organizer

### Notes
Remember to focus on **user experience** first!`,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    tags: ['projects', 'ideas'],
  },
  {
    id: '3',
    title: 'Meeting Notes',
    content: `# Team Meeting - Q1 Planning

**Date:** January 10, 2024  
**Attendees:** Sarah, Mike, Alex

## Agenda
1. Review Q4 results
2. Set Q1 objectives
3. Resource allocation

## Action Items
| Task | Owner | Due Date |
|------|-------|----------|
| Draft roadmap | Sarah | Jan 15 |
| Budget review | Mike | Jan 12 |
| Team survey | Alex | Jan 18 |

---

*Next meeting scheduled for January 17th*`,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    tags: ['meetings', 'planning'],
  },
  {
    id: '4',
    title: 'Quick Thoughts',
    content: `Some random thoughts and reminders:

- Call dentist for appointment
- Research new coffee shops downtown
- Book recommendation: "Atomic Habits"
- Look into Rust programming language`,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    tags: ['personal'],
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const createNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
    if (selectedNote?.id === id) {
      setSelectedNote((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  const reorderNotes = (activeId: string, overId: string) => {
    setNotes((prev) => {
      const oldIndex = prev.findIndex((note) => note.id === activeId);
      const newIndex = prev.findIndex((note) => note.id === overId);
      
      if (oldIndex === -1 || newIndex === -1) return prev;
      
      const newNotes = [...prev];
      const [movedNote] = newNotes.splice(oldIndex, 1);
      newNotes.splice(newIndex, 0, movedNote);
      
      return newNotes;
    });
  };

  // Separate pinned and unpinned, but maintain custom order within each group
  const pinnedNotes = notes.filter((note) => note.isPinned);
  const unpinnedNotes = notes.filter((note) => !note.isPinned);

  return {
    notes,
    pinnedNotes,
    unpinnedNotes,
    selectedNote,
    setSelectedNote,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    reorderNotes,
  };
}
