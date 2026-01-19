import { dbDriver } from "@/config/drizzle.db";
import { notesTable } from "@/config/note.schema";
import { Note } from "@/types/notes.core";
import { eq } from "drizzle-orm";

export interface UpdateNote {
  id: string;
  updates: Partial<Note>;
}

export async function updateNote({ id, updates }: UpdateNote): Promise<Note> {
  console.log('updateNote called with:', { id, updates });
  
  const updateData: any = {
    updatedAt: new Date().toISOString(),
  };

  if (updates.title !== undefined) {
    updateData.title = updates.title;
  }

  if (updates.content !== undefined) {
    updateData.content = updates.content;
  }

  if (updates.color !== undefined) {
    updateData.color = updates.color;
  }

  if (updates.isPinned !== undefined) {
    updateData.isPinned = updates.isPinned ? 'true' : 'false';
  }

  console.log('Final updateData:', updateData);

  try {
    const [updatedNote] = await dbDriver
      .update(notesTable)
      .set(updateData)
      .where(eq(notesTable.id, id))
      .returning();

    console.log('Update successful:', updatedNote);
    return updatedNote as unknown as Note;
  } catch (error) {
    console.error('Database update failed:', error);
    throw error;
  }
}