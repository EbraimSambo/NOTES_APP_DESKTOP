import { Note } from "@/types/notes.core";
import React from "react";


export const useUpdateNote = () => {
    const [note, setNote] = React.useState<Note | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    async function updateNoteSubmit(id: string, updates: Partial<Note>) {
        const updatedNote = await window.electron.invoke("update-note", { id, updates });
        setLoading(true);
        setError(null);
        setNote(updatedNote);
        setLoading(false);
    }
    return {
        updateNoteSubmit,
        note,
        loading,
        error
    }
};
