import { app, shell, BrowserWindow, ipcMain, dialog, protocol, net } from 'electron'
import { join } from 'path'
import fs from 'fs/promises'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ChildProcess, spawn } from 'child_process'
import path from 'path'
import { pathToFileURL } from 'url'

const dataFiles = path.join(app.getPath('userData'), 'data')
const imagesDir = path.join(app.getPath('userData'), 'images')

async function ensureDataDirs() {
  await fs.mkdir(dataFiles, { recursive: true })
}

ipcMain.handle('file:read', async (_event, filename: string) => {
  const filePath = path.join(dataFiles, `${filename}.json`)
  console.log('Reading from:', filePath)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code == "ENOENT") return null
    throw err
  }
})

ipcMain.handle('file:write', async (_event, filename: string, data: unknown) => {
  const filePath = path.join(dataFiles, `${filename}.json`)
  console.log(data)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  return true
})

ipcMain.handle('file:list', async () => {
  const files = await fs.readdir(dataFiles)
  return files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
})

ipcMain.handle('image:select', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Profile Picture',
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp']}],
    properties: ['openFile']
  })

  if (canceled || filePaths.length === 0) return null;
  return filePaths[0]
})

ipcMain.handle('image:import', async(_event, sourcePath: string, profileId: string) => {
  await fs.mkdir(imagesDir, { recursive: true })
  const ext = path.extname(sourcePath);
  const destPath = path.join(imagesDir, `${profileId}${ext}`)
  await fs.copyFile(sourcePath, destPath)
  return destPath
})

let crestProcess: ChildProcess | null = null;

function getCrestPath(): string {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'crest2', 'CREST2.EXE')
  } else {
    return path.join(app.getAppPath(), 'resources', 'crest2', 'CREST2.exe')
  }
}

function startCrest2(): void {
  const exePath = getCrestPath()

  crestProcess = spawn(exePath, [], {
    windowsHide: true
  })

  crestProcess.stdout?.on('data', (data) => {
    console.log(`CREST2: ${data}`);
  })

  crestProcess.stderr?.on('data', (data) => {
    console.log(`CREST2 error: ${data}`);
  })

  crestProcess.on('close', (code) => {
    console.log(`CREST2 exited with cod ${code}`)
    crestProcess = null
  })

  crestProcess.on('error', (err) => {
    console.error('Failed to start CREST2:', err)
  })
}

function stopCrest2(): void {
  if (crestProcess) {
    crestProcess.kill()
    crestProcess = null
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'appimage',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
])

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  protocol.handle('appimage', (request) => {
    const filename = request.url.replace('appimage://', '')
    const filePath = path.join(app.getPath('userData'), 'images', filename)
    return net.fetch(pathToFileURL(filePath).toString())
  })

  ensureDataDirs()
  startCrest2()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  stopCrest2()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopCrest2();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
