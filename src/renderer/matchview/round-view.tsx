import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch, MatchStatus, RoundStatus } from '../../common/immutable-match'
import { Round } from '../../common/immutable-round'
import { PairringTable } from './pairring-table'
import { FightingTable } from './fighting-table'
import { FinishedTable } from './finished-table'
import { Button } from 'react-bootstrap'
import * as assert from 'assert'

interface IRoundViewProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
  readonly round: number
}

interface IRoundViewState {}

export class RoundView extends React.PureComponent<IRoundViewProps, IRoundViewState> {
  private pairingData: Round | undefined

  constructor(props: IRoundViewProps) {
    super(props)

    this.pairingData = undefined
  }

  public componentWillReceiveProps?(nextProps: IRoundViewProps) {
    if (this.props.match.equals(nextProps.match) === false) {
      const roundDataInMatch: Round = this.props.match.getRoundData(this.props.round)
      this.setState({ roundData: roundDataInMatch })
    }
  }

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
        <PairringTable roundData={roundData} onPairingChanged={this.onUserModifiedPairing} />
      </div>
    )
  }

  private onUserModifiedPairing = (roundData: Round) => {
    this.pairingData = roundData
  }

  private startRound = () => {
    if (this.pairingData) {
      const roundDataInMatch = this.props.match.getRoundData(this.props.round)
      if (roundDataInMatch.equals(this.pairingData) === false) {
        this.props.manager.setCurrentRoundPairring(this.pairingData)
      }
    }

    this.props.manager.startCurrentRound(this.props.round)
  }

  private endCurrentRound = () => {
    this.props.manager.endCurrentRound()
  }
}
