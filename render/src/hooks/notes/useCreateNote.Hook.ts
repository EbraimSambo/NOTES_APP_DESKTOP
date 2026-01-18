import { CreateNote, createNote } from "@/actions/create-notes";
import { Note } from "@/types/notes.core";
import React from "react";
import { useAtom } from 'jotai';
import { notesAtom, createLoadingAtom, createErrorAtom, paginationAtom } from '@/store/atoms';

export function useCreateNote() {
    const [notes, setNotes] = useAtom(notesAtom);
    const [loading, setLoading] = useAtom(createLoadingAtom);
    const [error, setError] = useAtom(createErrorAtom);
    const [, setPagination] = useAtom(paginationAtom);
    
    async function submitCreateNote(note: CreateNote) {
        setLoading(true);
        setError(null);
        try {
            const newNote = await createNote(note);
            setNotes(prevNotes => [newNote, ...prevNotes]);
            // Reset pagination when new note is created
            setPagination({
                page: 1,
                limit: 10,
                hasMore: true,
                totalCount: notes.length + 1
            });
            return newNote;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create note');
            throw err;
        } finally {
            setLoading(false);
        }
    }
    
    return {
        submitCreateNote,
        loading,
        error
    };
}