import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { Note } from "@/types/notes.core";
import { eq } from "drizzle-orm";


export interface UpdateNote {
    id: string;
    updates: Partial<Note>;
}


export async function updateNote({ id, updates }: UpdateNote): Promise<Note> {
    const [updatedNote] = await dbDriver.update(notesTable).set({
        title: updates.title,
        content: updates.content,
        color: updates.color,
        isPinned: updates.isPinned ? 'true' : 'false',
        updatedAt: new Date().toISOString(),
    }).where(eq(notesTable.id, id)).returning();
    return updatedNote as unknown as Note;
}