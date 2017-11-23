/**
 * this is a test component, so I can try/test/learn:
 * 1. TypeScript
 * 2. Immutable
 * 3. ...
 */
import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Manager } from './manager'
import { ImmutableMatch } from '../common/immutable-match'
//import { debugLog } from '../common/debug-log'
import * as X from 'xlsx'
import * as Electron from 'electron'

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
    /* from app code, require('electron').remote calls back to main process */
    var dialog = Electron.remote.dialog

    /* show a file-open dialog and read the first selected file */
    var o = dialog.showOpenDialog(Electron.remote.getCurrentWindow(), { properties: ['openFile'] })
    var workbook = X.readFile(o[0])
    const sheetName = workbook.SheetNames[0]
    //const worksheet = workbook.Sheets[sheetName]
    //debugLog(worksheet['C2'], sheetName)

    this.doSomething(workbook, sheetName)

    /* show a file-save dialog and write the workbook */
    //var o = dialog.showSaveDialog()
    //XLSX.writeFile(workbook, o)
  }

  private doSomething(workbook: any, sheetName: string): void {}

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
