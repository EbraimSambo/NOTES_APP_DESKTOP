import { useAtom } from 'jotai';
import { notesAtom } from '@/store/atoms';
import { Note } from '@/types/notes.core';
import { updateNote } from '@/actions/update-notes';

export function useNoteActions() {
    const [notes, setNotes] = useAtom(notesAtom);

    const updateNoteById = async (id: string, updates: Partial<Note>) => {
        try {
            const updatedNote = await updateNote({ id, updates });
            setNotes(prevNotes => 
                prevNotes.map(note => 
                    note.id === id ? { ...note, ...updatedNote } : note
                )
            );
            return updatedNote;
        } catch (error) {
            console.error('Failed to update note:', error);
            throw error;
        }
    };

    const deleteNoteById = async (id: string) => {
        try {
            // Implementar deleteNote action quando disponível
            // await deleteNote(id);
            setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        } catch (error) {
            console.error('Failed to delete note:', error);
            throw error;
        }
    };

    const togglePinNote = async (id: string) => {
        const note = notes.find(n => n.id === id);
        if (!note) return;

        try {
            const updatedNote = await updateNote({ id, updates: { isPinned: !note.isPinned } });
            setNotes(prevNotes => 
                prevNotes.map(n => 
                    n.id === id ? { ...n, ...updatedNote } : n
                )
            );
            return updatedNote;
        } catch (error) {
            console.error('Failed to toggle pin:', error);
            throw error;
        }
    };

    return {
        updateNote: updateNoteById,
        deleteNote: deleteNoteById,
        togglePin: togglePinNote
    };
}
