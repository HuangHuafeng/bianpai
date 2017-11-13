import * as Electron from 'electron'
import { emit } from '../common/menu-event'

export function buildDefaultMenu(): Electron.Menu {
  let template: Array<Electron.MenuItemConstructorOptions> = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: emit('file-new'),
        },
        {
          label: 'Open',
          click: emit('file-open'),
        },
        {
          label: 'Save',
          click: emit('file-save'),
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      label: 'View',
      submenu: [
        {
          role: 'reload',
        },
        {
          role: 'forcereload',
        },
        {
          role: 'toggledevtools',
        },
        {
          role: 'togglefullscreen',
        },
      ],
    },
    {
      role: 'windowMenu',
    },
    {
      role: 'help',
      submenu: [],
    },
  ]

  if (process.platform === 'darwin') {
    const name = Electron.app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: `About ${name}`,
          click: emit('show-about'),
        },
        {
          type: 'separator',
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          role: 'hide',
        },
        {
          role: 'hideothers',
        },
        {
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
        },
      ],
    })
  }

  if (process.platform === 'win32') {
    const name = Electron.app.getName()

    // add the Exit menu item
    let fileSubmenu = template[0].submenu as Electron.MenuItemConstructorOptions[]
    fileSubmenu.push({
      role: 'quit',
    })

    // add the About menu item
    let submenu = template[template.length - 1].submenu as Electron.MenuItemConstructorOptions[]
    submenu.unshift({
      label: `About ${name}`,
      click: emit('show-about'),
    })
  }

  return Electron.Menu.buildFromTemplate(template)
}
