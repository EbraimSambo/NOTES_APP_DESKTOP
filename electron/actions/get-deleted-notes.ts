import { dbDriver } from "../config/drizzlle.config";
import { notesTable } from "../config/note.schema";
import { and, desc, isNotNull, sql } from "drizzle-orm";

interface GetDeletedNotesParams {
    page: number;
    limit: number;
}

export async function getDeletedNotes({ page, limit }: GetDeletedNotesParams) {
    return await dbDriver.transaction(async (tx) => {
        const notes = await tx.select()
            .from(notesTable)
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy(desc(notesTable.deletedAt))
            .where(isNotNull(notesTable.deletedAt));

        const total = await tx.select({ count: sql<number>`count(*)` }).from(notesTable)
            .where(isNotNull(notesTable.deletedAt))
            .then((res) => Number(res[0].count))
            
        return {
            notes: notes.map(note => ({
                ...note,
                color: note.color || undefined,
                isPinned: note.isPinned === 'true',
                deletedAt: note.deletedAt || null
            })),
            total
        }
    })
}
