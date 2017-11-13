import * as React from 'react'
import { Manager } from '../manager'
import { Match, MatchStatus, GameData } from '../../common/match'
import { PairringTableHeader } from './pairring-table-header'
import { PairringTableBody } from './pairring-table-body'
import { Button, Table } from 'react-bootstrap'
import * as assert from 'assert'

interface IRoundViewProps {
  readonly manager: Manager
  readonly match: Match
  readonly round: number
}

interface IRoundViewState {}

export class RoundView extends React.Component<IRoundViewProps, IRoundViewState> {
  constructor(props: IRoundViewProps) {
    super(props)
  }

  public render() {
    switch (this.getRoundStatus()) {
      case 'match-not-started':
        return this.renderMatchNotStarted()

      case 'not-started':
        return this.renderNotStarted()

      case 'pairing':
        return this.renderPairing()

      case 'ongoing':
        return this.renderOngoing()

      default:
        throw new Error('IMPOSSIBLE!')
    }
  }

  private getRoundStatus(): 'match-not-started' | 'not-started' | 'pairing' | 'ongoing' | 'finished' {
    const matchStatus = this.props.match.getStatus()
    const currentRound = this.props.match.getCurrentRound()
    if (matchStatus === MatchStatus.NotStarted) {
      assert.ok(currentRound === 0, 'IMPOSSIBLE!')
      return 'match-not-started'
    }
    if (this.props.round > currentRound) {
      return 'not-started'
    }

    if (this.props.round > currentRound) {
      return 'finished'
    }

    if (matchStatus === MatchStatus.OnGoingPairing) {
      return 'pairing'
    } else {
      return 'ongoing'
    }
  }

  private renderMatchNotStarted() {
    let start
    if (this.props.round === 1) {
      start = (
        <Button bsStyle="primary" onClick={this.startMatch}>
          开始比赛
        </Button>
      )
    }

    return (
      <div id="round-view">
        <p className="summary">比赛还没有开始</p>
        {start}
      </div>
    )
  }

  private renderNotStarted() {
    const currentRound = this.props.match.getCurrentRound()
    return (
      <p className="summary">
        正在进行第{currentRound}轮比赛，第{this.props.round}轮比赛还没有开始
      </p>
    )
  }

  private updateTableResult = (table: number, result: string) => {
    this.props.manager.updateTableResult(this.props.match.getCurrentRound(), table, result)
  }

  private renderOngoing() {
    const roundData: GameData[] = this.props.match.getRoundData(this.props.round)
    const disabled =
      roundData.findIndex(game => game.result !== '+' && game.result !== '=' && game.result !== '-') !== -1

    return (
      <div id="round-view">
        <Button bsStyle="primary" onClick={this.endCurrentRound} disabled={disabled}>
          结束本轮比赛
        </Button>
        <Table striped bordered condensed hover responsive>
          <PairringTableHeader manager={this.props.manager} updatable={true} />
          <PairringTableBody
            manager={this.props.manager}
            roundData={roundData}
            updatable={true}
            updateCallback={this.updateTableResult}
          />
        </Table>
      </div>
    )
  }

  private renderPairing() {
    const roundData: GameData[] = this.props.match.getRoundData(this.props.round)

    return (
      <div id="round-view">
        <Button bsStyle="primary" onClick={this.startRound}>
          开始本轮比赛
        </Button>
        <Table striped bordered condensed hover responsive>
          <PairringTableHeader manager={this.props.manager} />
          <PairringTableBody manager={this.props.manager} roundData={roundData} />
        </Table>
      </div>
    )
  }

  private startRound = () => {
    this.props.manager.startCurrentRound(this.props.round)
  }

  private startMatch = () => {
    this.props.manager.startMatch()
  }

  private endCurrentRound = () => {
    this.props.manager.endCurrentRound()
  }
}
