import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  version: process.versions.electron,
  invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args)
})
