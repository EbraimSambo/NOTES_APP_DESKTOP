import { dbDriver } from "../config/drizzlle.config";
import { notesTable } from "../config/note.schema";
import { eq } from "drizzle-orm";

export async function restoreNote(id: string): Promise<void> {
  console.log('restoreNote called with:', { id });
  
  try {
    await dbDriver
      .update(notesTable)
      .set({ 
        deletedAt: null,
        updatedAt: new Date().toISOString()
      })
      .where(eq(notesTable.id, id));

    console.log('Note restored successfully:', id);
  } catch (error) {
    console.error('Database restore failed:', error);
    throw error;
  }
}
