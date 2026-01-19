// "use server";
import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { Note } from "@/types/notes.core";

export interface CreateNote{
    note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'orderId'> & { title: string; content: string }
}
export async function createNote({note}:CreateNote): Promise<Note> {
    try {
        // Get the highest current orderId to place new note at the beginning
        const maxOrderResult = await dbDriver.select({ orderId: notesTable.orderId })
            .from(notesTable)
            .orderBy(notesTable.orderId)
            .limit(1);
        
        const nextOrderId = maxOrderResult.length > 0 ? maxOrderResult[0].orderId - 1 : 0;
        
        const [newNote] = await dbDriver.insert(notesTable).values({
            ...note,
            orderId: nextOrderId,
            isPinned: note?.isPinned ? 'true' : 'false',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null
        }).returning();
        return {
            ...newNote,
            isPinned: newNote.isPinned === "true"
        } as unknown as Note;
    } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to create note');
    }
}