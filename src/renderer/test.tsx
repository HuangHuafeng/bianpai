/**
 * this is a test component, so I can try/test/learn:
 * 1. TypeScript
 * 2. Immutable
 * 3. ...
 */
import * as React from 'react'
import * as Electron from 'electron'
import { Button } from 'react-bootstrap'
import { Manager } from './manager'
import { ImmutableMatch } from '../common/immutable-match'
import { debugLog } from '../common/helper-functions'
const printHtml = require('./print.html')

export enum PopupType {
  About = 1,
  NewMatch,
  AddPlayer,
  RemovePlayer,
  EditPlayer,
  EditMatch,
  RemoveAllPlayers,
}

interface ITestProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface ITestState {}

export class Test extends React.Component<ITestProps, ITestState> {
  constructor(props: ITestProps) {
    super(props)
    debugLog('Test constructed')
  }

  private testCode = () => {
    debugLog(__DEV__)
    debugLog(__WIN32__)
    debugLog(__LINUX__)
    debugLog(__DARWIN__)
    debugLog(process.env.NODE_ENV)
    debugLog(process.env)

    let win: any = new Electron.remote.BrowserWindow({ width: 400, height: 320 })
    win.on('close', function() {
      win = null
    })
    //win.loadURL(printHtml)
    const html = ['<body>', printHtml, '</body>'].join('')
    win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html))
    win.show()
    console.log(Electron.remote.app.getLocale())
    /*
    let win: Electron.BrowserWindow | null = new Electron.remote.BrowserWindow({ width: 400, height: 320 })
    win.on('close', function() {
      win = null
    })
    const html = ['<body>', '<h1>It works</h1>', '</body>'].join('')
    win.loadURL('data:text/html;charset=utf-8,' + encodeURI(html))
    win.show()
    win.on('ready-to-show', () => {
      win = win as Electron.BrowserWindow
      win.webContents.printToPDF({}, (error, buffer) => {
        fs.writeFileSync('wc.pdf', buffer)
      })
    })
    */
  }

  public render() {
    return (
      <div id="test">
        {this.props.match.name}
        <Button bsStyle="primary" onClick={this.testCode}>
          TEST
        </Button>
      </div>
    )
  }
}
