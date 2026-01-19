import { app, BrowserWindow, protocol, net, Menu } from 'electron'
import path from 'path'
import { pathToFileURL } from 'url'

const isDev = !app.isPackaged

// Register protocol as standard and secure
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
        show: false, // 👈 IMPORTANTE
        webPreferences: {}
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

app.whenReady().then(() => {
    // Register protocol to handle Next.js absolute paths (/_next/...)
    protocol.handle('app', (request) => {
        let url = request.url.slice('app://'.length)

        // Remove ./ if present at the start
        if (url.startsWith('./')) {
            url = url.slice(2)
        }

        // If URL is empty or just /, load index.html
        if (!url || url === '/') {
            url = 'index.html'
        }

        // Create the absolute path to the file in the render folder
        const filePath = path.join(__dirname, '../render', url)

        return net.fetch(pathToFileURL(filePath).toString())
    })

    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
