'use strict'

import { app, BrowserWindow, Menu } from 'electron'
import { buildDefaultMenu } from './default-menu'

const isDevelopment = process.env.NODE_ENV !== 'production'

// Global reference to mainWindow
// Necessary to prevent win from being garbage collected
let mainWindow: Electron.BrowserWindow | null = null

function createMainWindow() {
  // Construct new BrowserWindow
  const window = new BrowserWindow({ width: 900, height: 600 })

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

  /*
  window.on('close', function(e) {
    var choice = require('electron').dialog.showMessageBox(this, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'Are you sure you want to quit?',
    })
    if (choice == 1) {
      e.preventDefault()
    }
  })
  */

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
})
