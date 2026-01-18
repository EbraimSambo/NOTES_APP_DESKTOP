"use server";

import { prisma } from "@/config/prisma.config";


interface GetNotesParams {
    page: number;
    limit: number;
}

export async function getNotes({ page, limit }: GetNotesParams) {
    const notes = await prisma.note.findMany({
        skip: (page - 1) * limit,
        take: limit,
    });
    return notes.map(note => ({
        ...note,
        color: note.color || undefined,
        isPinned: note.isPinned || false,
    }));
}
