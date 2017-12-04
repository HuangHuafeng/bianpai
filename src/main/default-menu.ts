import * as Electron from 'electron'
import { emit } from '../common/menu-event'

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
      {
        label: '关闭',
        accelerator: 'CmdOrCtrl+W',
        click: emit('file-close'),
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

export function buildDefaultMenu(): Electron.Menu {
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

    addUpdateMenuItems(template[0].submenu, 1)
  }

  if (process.platform === 'win32') {
    const name = Electron.app.getName()

    // add the Exit menu item
    let fileSubmenu = template[0].submenu as Electron.MenuItemConstructorOptions[]
    fileSubmenu.push({
      label: '退出',
      accelerator: 'CmdOrCtrl+Q',
      role: 'quit',
    })

    // add the About menu item
    let helpMenu = template[template.length - 1].submenu as Electron.MenuItemConstructorOptions[]
    helpMenu.unshift({
      label: `关于${name}`,
      click: emit('show-about'),
    })

    addUpdateMenuItems(helpMenu, 0)
  }

  return Electron.Menu.buildFromTemplate(template)
}

function addUpdateMenuItems(items: any, position: any) {
  if (process.mas) return

  let updateItems = [
    {
      label: '检查更新',
      visible: true,
      key: 'checkForUpdate',
      click: emit('checkForUpdate'),
    },
    {
      label: '重启并安装新版本',
      enabled: false,
      key: 'quitAndInstall',
      click: emit('quitAndInstall'),
    },
  ]

  items.splice.apply(items, [position, 0].concat(updateItems))
}
