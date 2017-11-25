import * as React from 'react'
import { Button } from 'react-bootstrap'
import * as assert from 'assert'
import { Manager } from '../manager'
import { ImmutableMatch, MatchStatus, RoundStatus } from '../../common/immutable-match'
import { Round } from '../../common/immutable-round'
import { PairringTable } from './pairring-table'
import { FightingTable } from './fighting-table'
import { FinishedTable } from './finished-table'

interface IRoundViewProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
  readonly round: number
}

interface IRoundViewState {
  roundData: Round
}

export class RoundView extends React.PureComponent<IRoundViewProps, IRoundViewState> {
  constructor(props: IRoundViewProps) {
    super(props)
  }

  /*
  public componentWillReceiveProps(nextProps: IRoundViewProps) {
    if (this.props.match.equals(nextProps.match) === false) {
      const roundDataInMatch: Round = nextProps.match.getRoundData(this.props.round)
      this.setState({ roundData: roundDataInMatch })
    }
  }

  public shouldComponentUpdate(nextProps: IRoundViewProps, nextState: IRoundViewState, nextContext: any): boolean {
    if (
      nextProps.match !== this.props.match ||
      nextProps.round !== this.props.round ||
      nextProps.manager !== this.props.manager
    ) {
      return true
    }

    if (nextState.roundData !== undefined) {
      return true
    }

    return false
  }
  */

  public render() {
    const matchStatus = this.props.match.status
    if (matchStatus !== MatchStatus.NotStarted) {
      switch (this.props.match.getRoundStatus(this.props.round)) {
        case RoundStatus.NotStarted:
          return this.renderNotStarted()

        case RoundStatus.OnGoingPairing:
          return this.renderPairing()

        case RoundStatus.OnGoingFighting:
          return this.renderOngoing()

        case RoundStatus.Finished:
          return this.renderFinished()

        default:
          assert.ok(false, 'IMPOSSIBLE!')
          return null
      }
    } else {
      return this.renderMatchNotStarted()
    }
  }

  private renderMatchNotStarted() {
    return (
      <div id="round-view">
        <p className="summary">比赛还没有开始</p>
      </div>
    )
  }

  private renderNotStarted() {
    return <p className="summary">本轮比赛还没有开始</p>
  }

  private updateTableResult = (table: number, result: string) => {
    this.props.manager.updateTableResult(this.props.match.currentRound, table, result)
  }

  private renderFinished() {
    const roundData: Round = this.props.match.getRoundData(this.props.round)

    return (
      <div id="round-view">
        <p className="summary">本轮比赛已经结束</p>
        <FinishedTable roundData={roundData} />
      </div>
    )
  }

  private renderOngoing() {
    const roundData: Round = this.props.match.getRoundData(this.props.round)
    const disabled = roundData.canEnd() === false

    return (
      <div id="round-view">
        <Button bsStyle="primary" onClick={this.endCurrentRound} disabled={disabled}>
          结束本轮比赛
        </Button>
        <FightingTable roundData={roundData} updateCallback={this.updateTableResult} />
      </div>
    )
  }

  private renderPairing() {
    const roundData: Round = this.props.match.getRoundData(this.props.round)

    return (
      <div id="round-view">
        <Button bsStyle="primary" onClick={this.startRound}>
          对阵安排完成，开始本轮比赛
        </Button>
        <Button bsStyle="primary" onClick={this.restorePairing}>
          恢复为软件安排的对阵
        </Button>
        <Button bsStyle="primary" onClick={this.printPairingToPDF}>
          打印对阵表
        </Button>
        <PairringTable
          roundData={roundData}
          playerList={this.props.match.playerList}
          changePlayerCallback={this.onExchangePlayerInGame}
        />
      </div>
    )
  }

  private onExchangePlayerInGame = (table: number, currentPlayerNumber: number, withPlayerNumber: number) => {
    this.props.manager.changePlayerInGame(table, currentPlayerNumber, withPlayerNumber)
  }

  private printPairingToPDF = () => {
    this.props.manager.print({ type: 'pairing-table', round: this.props.round })
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

  private restorePairing = () => {
    this.props.manager.resetPairing()
  }

  private startRound = () => {
    this.props.manager.startCurrentRound(this.props.round)
  }

  private endCurrentRound = () => {
    this.props.manager.endCurrentRound()
  }
}
