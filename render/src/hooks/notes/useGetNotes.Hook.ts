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

    async function fetchNotes() {
        try {
            setLoading(true);
            setError(null);
            const notesServer = await getNotes({ page, limit });
            setNotes(notesServer);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }
    
    React.useEffect(() => {
        fetchNotes();
    }, [page, limit]);

    return {
        notes,
        loading,
        error,
        refetch: fetchNotes,
    };
}