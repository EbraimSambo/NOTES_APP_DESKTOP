"use server";
import { prisma } from "@/config/prisma.config";
import { Note } from "@/types/notes.core";


export async function createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
        const newNote = await prisma.note.create({ 
            data: {
                title: note.title,
                content: note.content,
                color: note.color || 'default',
                isPinned: note.isPinned || false,
                tags: note.tags && note.tags.length > 0 ? {
                    create: note.tags.map((tag) => ({ name: tag.name })),
                } : undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            include: {
                tags: true,
            }
        });
        return newNote;
    } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to create note');
    }
}