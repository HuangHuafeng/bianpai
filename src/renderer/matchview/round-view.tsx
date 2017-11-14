import * as React from 'react'
import { Manager } from '../manager'
import { Match, MatchStatus, GameData, RoundStatus } from '../../common/match'
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
    const matchStatus = this.props.match.getStatus()
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

  private renderFinished() {
    const roundData: GameData[] = this.props.match.getRoundData(this.props.round)

    return (
      <div id="round-view">
        <p className="summary">本轮比赛已经结束</p>
        <Table striped bordered condensed hover responsive>
          <PairringTableHeader manager={this.props.manager} />
          <PairringTableBody manager={this.props.manager} roundData={roundData} />
        </Table>
      </div>
    )
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

  private endCurrentRound = () => {
    this.props.manager.endCurrentRound()
  }
}
