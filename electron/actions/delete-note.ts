import { dbDriver } from "../config/drizzlle.config";
import { notesTable } from "../config/note.schema";
import { eq } from "drizzle-orm";

export async function deleteNote(id: string): Promise<void> {
  console.log('deleteNote called with:', { id });
  
  try {
    await dbDriver
      .update(notesTable)
      .set({ 
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(notesTable.id, id));

    console.log('Note soft deleted successfully:', id);
  } catch (error) {
    console.error('Database delete failed:', error);
    throw error;
  }
}
