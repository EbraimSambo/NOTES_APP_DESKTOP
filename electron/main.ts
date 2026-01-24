import { app, BrowserWindow, protocol, net, Menu, ipcMain } from 'electron'
import path from 'path'
import { pathToFileURL } from 'url'
import { execSync } from 'child_process' // 👈 Adicionado para rodar comandos
import { getDeletedNotes } from './actions/get-deleted-notes'
import { CreateNote, createNote } from './actions/create-notes'
import { updateNote, UpdateNote } from './actions/update-notes'
import { exposeApi } from './api/electron.api'
import { setupDatabase } from './config/setupdb'
const isDev = !app.isPackaged


protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            allowServiceWorkers: true,
            corsEnabled: true
        }
    }
])

function createWindow() {
    Menu.setApplicationMenu(null)
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        title: 'Notes',
        icon: path.join(__dirname, '../assets/images/logo.png'),
        show: false,
        webPreferences: {
            // Recomendo ativar se for usar node no renderer, 
            // // mas mantenha desativado por segurança se não precisar
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../dist/preload.js')
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:3001')
    } else {
        win.loadURL('app://./index.html')
    }

    win.once('ready-to-show', () => {
        win.show()
    })
}

app.whenReady().then(async () => {
    setupDatabase()
    protocol.handle('app', (request) => {
        let url = request.url.slice('app://'.length)
        if (url.startsWith('./')) url = url.slice(2)
        if (!url || url === '/') url = 'index.html'

        const filePath = path.join(__dirname, '../render', url)
        return net.fetch(pathToFileURL(filePath).toString())
    })

    // 3. Abre a janela
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

exposeApi(ipcMain)

