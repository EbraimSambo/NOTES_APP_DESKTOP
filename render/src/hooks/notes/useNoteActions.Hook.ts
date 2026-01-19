import { useAtom } from 'jotai';
import { notesAtom } from '@/store/atoms';
import { Note } from '@/types/notes.core';
import { updateNote } from '@/actions/update-notes';
import { deleteNote } from '@/actions/delete-note';
import { restoreNote } from '@/actions/restore-note';

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
            await deleteNote(id);
            setNotes(prevNotes => 
                prevNotes.map(note => 
                    note.id === id ? { ...note, deletedAt: new Date() } : note
                )
            );
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

    const restoreNoteById = async (id: string) => {
        try {
            await restoreNote(id);
            setNotes(prevNotes => 
                prevNotes.map(note => 
                    note.id === id ? { ...note, deletedAt: undefined } : note
                )
            );
        } catch (error) {
            console.error('Failed to restore note:', error);
            throw error;
        }
    };

    return {
        updateNote: updateNoteById,
        deleteNote: deleteNoteById,
        togglePin: togglePinNote,
        restoreNote: restoreNoteById
    };
}
