import { CreateNote, createNote } from "@/actions/create-notes";
import { Note } from "@/types/notes.core";
import React from "react";

export function useCreateNote() {
    const [newNote, setNewNote] = React.useState<Note | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    async function submitCreateNote(note: CreateNote) {
        setLoading(true);
        setError(null);
        try {
            const newNote = await createNote(note);
            setNewNote(newNote);
            return newNote;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create note');
            throw err;
        } finally {
            setLoading(false);
        }
    }
    return {
        note: newNote,
        submitCreateNote,
        loading,
        error,setNewNote

    }
}