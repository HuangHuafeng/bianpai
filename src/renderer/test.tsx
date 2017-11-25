/**
 * this is a test component, so I can try/test/learn:
 * 1. TypeScript
 * 2. Immutable
 * 3. ...
 */
import * as React from 'react'
import * as Electron from 'electron'
import * as path from 'path'
import { Button } from 'react-bootstrap'
import { Manager } from './manager'
import { ImmutableMatch } from '../common/immutable-match'
import { debugLog } from '../common/helper-functions'

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
  }

  private testCode = () => {
    debugLog(__DEV__)
    debugLog(__WIN32__)
    debugLog(__LINUX__)
    debugLog(__DARWIN__)
    debugLog(process.env.NODE_ENV)
    debugLog(process.env)

    const modalPath = path.join('file://', __dirname, '../print.html')
    debugLog(modalPath)
    let win: any = new Electron.remote.BrowserWindow({ width: 400, height: 320 })
    win.on('close', function() {
      win = null
    })
    win.loadURL(modalPath)
    win.show()
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
