"use server";

import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { prisma } from "@/config/prisma.config";


interface GetNotesParams {
    page: number;
    limit: number;
}

export async function getNotes({ page, limit }: GetNotesParams) {
    const notes = await dbDriver.select().from(notesTable).limit(limit).offset((page - 1) * limit);
    return notes.map(note => ({
        ...note,
        color: note.color || undefined,
        isPinned: Boolean(note.isPinned),
    }));
}
