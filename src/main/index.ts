'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import * as AppUpdater from 'electron-updater'
import * as logger from 'winston'
import { buildDefaultMenu } from './default-menu'

const isDevelopment = process.env.NODE_ENV !== 'production'

logger.configure({
  transports: [new logger.transports.File({ filename: './bianpai.log' })],
})

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow: Electron.BrowserWindow | null = null
let myAutoUpdater: AppUpdater.AppUpdater

function createMainWindow() {
  // Construct new BrowserWindow
  const window = new BrowserWindow({ width: 900, height: 800 })

  // Set url for `win`
  // points to `webpack-dev-server` in development
  // points to `index.html` in production
  const url = isDevelopment
    ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    : `file://${__dirname}/index.html`

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  window.loadURL(url)

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })

  return window
}

// Quit application when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user explicitly quits
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  // On macOS it is common to re-create a window
  // even after all windows have been closed
  if (mainWindow === null) mainWindow = createMainWindow()
})

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
  let menu = buildDefaultMenu()
  Menu.setApplicationMenu(menu)
  setAutoUpdater(mainWindow)
})

function setAutoUpdater(window: Electron.BrowserWindow) {
  myAutoUpdater = AppUpdater.autoUpdater
  myAutoUpdater.logger = logger

  // when the update has been downloaded and is ready to be installed, notify the BrowserWindow
  myAutoUpdater.on('update-downloaded', info => {
    // enable the menu
    let quitAndInstallMenuItem = findQuitAndInstallMenuItem()
    if (quitAndInstallMenuItem) quitAndInstallMenuItem.enabled = true

    window.webContents.send('updateReady')
  })

  myAutoUpdater.on('error', err => {
    logger.error(err.message)
    // we do nothing here after logging the error
    // in most cases, it's because user cannot access github.com
    /*
    const options = {
      type: 'error',
      title: 'Error',
      buttons: ['Ok'],
      message: err.message,
    }
    dialog.showMessageBox(window, options)
    */
  })

  ipcMain.on('checkForUpdate', (event: any, arg: any) => {
    myAutoUpdater.checkForUpdates()
  })

  // when receiving a quitAndInstall signal, quit and install the new version ;)
  ipcMain.on('quitAndInstall', (event: any, arg: any) => {
    myAutoUpdater.quitAndInstall()
  })

  myAutoUpdater.checkForUpdates()
}

function findQuitAndInstallMenuItem(): Electron.MenuItem | undefined {
  const menu = Menu.getApplicationMenu()
  if (!menu) {
    return undefined
  }

  let quitAndInstallMenuItem
  menu.items.forEach(function(item: any) {
    if (item.submenu) {
      item.submenu.items.forEach(function(item: any) {
        if (item.key === 'quitAndInstall') {
          quitAndInstallMenuItem = item
        }
      })
    }
  })
  return quitAndInstallMenuItem
}
