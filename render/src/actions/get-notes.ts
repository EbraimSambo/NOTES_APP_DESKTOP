"use server";

import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { and, desc, eq, sql } from "drizzle-orm";


interface GetNotesParams {
    page: number;
    limit: number;
    isPinned?: boolean;
}

export async function getNotes({ page, limit, isPinned }: GetNotesParams) {
    return await dbDriver.transaction(async (tx) => {
        const notes = await tx.select()
            .from(notesTable)
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy(desc(notesTable.createdAt))
            .where(
                and(
                    isPinned ? eq(notesTable.isPinned, 'true') : undefined
                )
            );

        const total = await  tx.select({ count: sql<number>`count(*)` }).from(notesTable)
         .then((res) => Number(res[0].count))
        return {
            notes: notes.map(note => ({
                ...note,
                color: note.color || undefined,
                isPinned: note.isPinned === 'true',
            })),
            total
        }
    })
}
