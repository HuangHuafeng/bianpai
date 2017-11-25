import * as React from 'react'
import * as Electron from 'electron'
import * as fs from 'fs'
import { Manager } from './manager'
import { Button } from 'react-bootstrap'
import { FinishedTable } from './matchview/finished-table'
import { MatchResult } from './matchview/match-result'

interface IPrintViewProps {
  readonly manager: Manager
  readonly conetent: any
}

interface IPrintViewState {
  readonly pdfData: Buffer | undefined
}

export class PrintView extends React.Component<IPrintViewProps, IPrintViewState> {
  constructor(props: IPrintViewProps) {
    super(props)

    this.state = { pdfData: undefined }
  }

  public componentDidMount(): void {
    // PrintView should be the top/only content of the current window
    // save the content of the window to PDF
    const webContents = Electron.remote.getCurrentWebContents()
    webContents.printToPDF({ pageSize: 'A4' }, this.savePDFData)
  }

  private savePDFData = (error: Error, buffer: Buffer): void => {
    if (error) {
      throw error
    } else {
      this.setState({ pdfData: buffer })
    }
  }

  private finishPrint = () => {
    this.setState({ pdfData: undefined })
    this.props.manager.print(undefined)
  }

  private saveToPDF = () => {
    const options = {
      filters: [{ name: '', extensions: ['pdf'] }],
    }
    /* show a file-open dialog and read the first selected file */
    var fileName = Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), options)
    if (fileName) {
      fs.writeFileSync(fileName, this.state.pdfData)
    }
  }

  public render() {
    return (
      <div id="printing">
        {this.renderButtons()}
        {this.renderPairingTable()}
        {this.renderMatchResult()}
      </div>
    )
  }

  private renderButtons() {
    if (this.state.pdfData === undefined) {
      return null
    }

    return (
      <div id="printing-buttons">
        <Button bsStyle="primary" onClick={this.saveToPDF}>
          保存到PDF文件
        </Button>
        <Button bsStyle="primary" onClick={this.finishPrint}>
          返回
        </Button>
      </div>
    )
  }

  private renderPairingTable() {
    if (this.props.conetent.type === undefined || this.props.conetent.type !== 'pairing-table') {
      return null
    }

    const round: number = this.props.conetent.round
    const match = this.props.manager.getMatch()
    const roundData = match.getRoundData(round)

    return (
      <div id="printing-pairing-table">
        <h1>{match.name}</h1>
        <h3>{match.organizer}</h3>
        <p>{'第' + round + '轮对阵表'}</p>
        <FinishedTable roundData={roundData} />
      </div>
    )
  }

  private renderMatchResult() {
    if (this.props.conetent.type === undefined || this.props.conetent.type !== 'pairing-match-result') {
      return null
    }

    const match = this.props.manager.getMatch()

    return (
      <div id="printing-pairing-table">
        <h1>{match.name}</h1>
        <h3>{match.organizer}</h3>
        <MatchResult manager={this.props.manager} match={match} printing />
      </div>
    )
  }
}
