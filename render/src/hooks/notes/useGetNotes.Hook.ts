import React from "react";
import { Note } from '@/types/notes.core';
import { getNotes } from "@/actions/get-notes";


interface GetNotesParams {
    page?: number;
    limit?: number;
}

export function useGetNotes({ page = 1, limit = 10 }: GetNotesParams) {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchNotes = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const notesServer = await getNotes({ page, limit });
            setNotes(notesServer as unknown as Note[]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    React.useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const reorderNotes = (activeId: string, overId: string) => {
        setNotes(prevNotes => {
            const oldIndex = prevNotes.findIndex(note => note.id === activeId);
            const newIndex = prevNotes.findIndex(note => note.id === overId);
            
            if (oldIndex === -1 || newIndex === -1) return prevNotes;
            
            const newNotes = [...prevNotes];
            const [movedNote] = newNotes.splice(oldIndex, 1);
            newNotes.splice(newIndex, 0, movedNote);
            
            // Update orderId for all notes
            return newNotes.map((note, index) => ({
                ...note,
                orderId: index
            }));
        });
    };
    return {
        notes,
        loading,
        error,
        setNotes,
        reorderNotes
    };
}