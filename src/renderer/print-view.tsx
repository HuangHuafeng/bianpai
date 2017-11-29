import * as React from 'react'
import * as Electron from 'electron'
import * as fs from 'fs'
import { Manager } from './manager'
import { Button } from 'react-bootstrap'
import { FinishedTable } from './matchview/finished-table'
import { MatchResult } from './matchview/match-result'
import { MatchFooter } from './matchview/match-footer'

export const SupportedPrintContentType = {
  RoundResult: 'ROUND_RESULT',
  RoundPairingTable: 'ROUND_PAIRING_TABLE',
  PlayerRanking: 'PLAYER_RANKING'
}

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
    const defaultName = this.generateDefaultFileName()
    const options = {
      defaultPath: defaultName,
      filters: [{ name: 'Adobe Acrobat Document', extensions: ['pdf'] }],
    }
    /* show a file-open dialog and read the first selected file */
    var fileName = Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), options)
    if (fileName) {
      fs.writeFileSync(fileName, this.state.pdfData)
    }
  }

  private generateDefaultFileName(): string {
    if (this.props.conetent.type === undefined) {
      return ''
    }

    let fileName: string = ''
    switch (this.props.conetent.type) {
      case SupportedPrintContentType.PlayerRanking:
        fileName = '名次'
        break

      case SupportedPrintContentType.RoundPairingTable:
        fileName = '第' + this.props.conetent.round + '轮对阵表'
        break

      case SupportedPrintContentType.RoundResult:
        fileName = '第' + this.props.conetent.round + '轮结果'
        break

      default:
        throw new Error('UNEXPECTED! unknown print content.')
    }

    return fileName
  }

  public render() {
    return (
      <div id="printing">
        {this.renderButtons()}
        {this.renderRoundPairing()}
        {this.renderRoundResult()}
        {this.renderMatchResult()}
        <MatchFooter manager={this.props.manager} match={this.props.manager.getMatch()} />
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

  private renderRoundResult() {
    if (this.props.conetent.type === undefined || this.props.conetent.type !== SupportedPrintContentType.RoundResult) {
      return null
    }

    const round: number = this.props.conetent.round
    const match = this.props.manager.getMatch()
    const roundData = match.getRoundData(round)

    return (
      <div id="printing-round-result">
        <h3>{match.name}</h3>
        <h4>{'第' + round + '轮结果'}</h4>
        <FinishedTable roundData={roundData} />
      </div>
    )
  }

  private renderRoundPairing() {
    if (this.props.conetent.type === undefined || this.props.conetent.type !== SupportedPrintContentType.RoundPairingTable) {
      return null
    }

    const round: number = this.props.conetent.round
    const match = this.props.manager.getMatch()
    const roundData = match.getRoundData(round)

    return (
      <div id="printing-round-pairing">
        <h3>{match.name}</h3>
        <h4>{'第' + round + '轮对阵表'}</h4>
        <FinishedTable roundData={roundData} dontShowResult />
      </div>
    )
  }

  private renderMatchResult() {
    if (this.props.conetent.type === undefined || this.props.conetent.type !== SupportedPrintContentType.PlayerRanking) {
      return null
    }

    const match = this.props.manager.getMatch()

    return (
      <div id="printing-pairing-table">
        <h3>{match.name}</h3>
        <MatchResult manager={this.props.manager} match={match} printing />
      </div>
    )
  }
}
