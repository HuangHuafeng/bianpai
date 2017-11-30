import * as Electron from 'electron'
import { emit } from '../common/menu-event'

export function buildDefaultMenu(): Electron.Menu {
  let template: Array<Electron.MenuItemConstructorOptions> = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: emit('file-new'),
        },
        {
          label: '打开',
          accelerator: 'CmdOrCtrl+O',
          click: emit('file-open'),
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: emit('file-save'),
        },
      ],
    },
    {
      role: 'editMenu',
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [],
    },
  ]

  if (__DEV__) {
    template.splice(2, 0, {
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
    })
  }

  if (process.platform === 'darwin') {
    const name = Electron.app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          label: `关于${name}`,
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
      label: '退出(&X)',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit',
    })

    // add the About menu item
    let submenu = template[template.length - 1].submenu as Electron.MenuItemConstructorOptions[]
    submenu.unshift({
      label: `关于${name}(&A)`,
      click: emit('show-about'),
    })
  }

  return Electron.Menu.buildFromTemplate(template)
}
