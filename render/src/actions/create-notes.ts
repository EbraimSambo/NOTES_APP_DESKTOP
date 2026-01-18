"use server";
import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { Note } from "@/types/notes.core";


export async function createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const newNote = await dbDriver.insert(notesTable).values({
            ...note,
            isPinned: note.isPinned ? 'true' : 'false',
        }).returning();
        return newNote;
    } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to create note');
    }
}