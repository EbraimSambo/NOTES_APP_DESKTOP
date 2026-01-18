"use server";

import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { desc } from "drizzle-orm";


interface GetNotesParams {
    page: number;
    limit: number;
}

export async function getNotes({ page, limit }: GetNotesParams) {
    const notes = await dbDriver.select()
    .from(notesTable)
    .limit(limit)
    .offset((page - 1) * limit)
    .orderBy(desc(notesTable.createdAt));
    return notes.map(note => ({
        ...note,
        color: note.color || undefined,
        isPinned: note.isPinned === 'true',
    }));
}
