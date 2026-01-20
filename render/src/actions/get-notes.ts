"use server";
import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";


interface GetNotesParams {
    page: number;
    limit: number;
    isPinned?: boolean;
    isDeleted?: boolean;
}

export async function getNotes({ page, limit, isPinned, isDeleted }: GetNotesParams) {
    
    return await dbDriver.transaction(async (tx: any) => {
        const notes = await tx.select()
            .from(notesTable)
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy(desc(notesTable.createdAt))
            .where(
                and(
                    isPinned ? eq(notesTable.isPinned, 'true') : undefined,
                    isDeleted ? isNotNull(notesTable.deletedAt) : isNull(notesTable.deletedAt)
                )
            );

        const total = await tx.select({ count: sql<number>`count(*)` }).from(notesTable)
            .where(
                and(
                    isPinned ? eq(notesTable.isPinned, 'true') : undefined,
                    isDeleted ? isNotNull(notesTable.deletedAt) : isNull(notesTable.deletedAt)
                )
            )
            .then((res: any) => Number(res[0].count))
        return {
            notes: notes.map((note: any) => ({
                ...note,
                color: note.color || undefined,
                isPinned: note.isPinned === 'true',
                deletedAt: note.deletedAt || null
            })),
            total
        }
    })
}
