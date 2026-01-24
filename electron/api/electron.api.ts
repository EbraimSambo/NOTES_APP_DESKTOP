import { createNote, CreateNote } from "../actions/create-notes";
import { deleteNote } from "../actions/delete-note";
import { getDeletedNotes } from "../actions/get-deleted-notes";
import { getNotes } from "../actions/get-notes";
import { restoreNote } from "../actions/restore-note";
import { updateNote, UpdateNote } from "../actions/update-notes";


export async function exposeApi(ipcMain: Electron.IpcMain) {

    ipcMain.handle("get-notes", async (
        _event,
        { page, limit }: { page: number; limit: number }
    ) => {
        console.log("Getting notes:", page, limit)
        return await getNotes({ page, limit })
    });

    ipcMain.handle("get-deleted-notes", async (
        _event,
        { page, limit }: { page: number; limit: number }
    ) => {
        return await getDeletedNotes({ page, limit })
    });

    ipcMain.handle("create-note", async (
        _event,
        { note }: CreateNote
    ) => {
        console.log("Creating note:", note)
        return await createNote({ note })
    });

    ipcMain.handle("update-note", async (
        _event,
        { id, updates }: UpdateNote
    ) => {
        console.log("Updating note:", id, updates)
        return await updateNote({ id, updates })
    });

    ipcMain.handle("delete-note", async (
        _event,
        { id }: { id: string }
    ) => {
        console.log("Deleting note:", id)
        return await deleteNote(id)
    });

    ipcMain.handle("restore-note", async (
        _event,
        { id }: { id: string }
    ) => {
        console.log("Restoring note:", id)
        return await restoreNote(id)
    });



}