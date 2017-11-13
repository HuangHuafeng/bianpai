import * as React from 'react'
import { Manager } from '../manager'
import { Match, MatchStatus } from '../../common/match'
import { RoundView } from './round-view'
import { NextRound } from './next-round'
import { Button } from 'react-bootstrap'

interface IMatchRoundsProps {
  readonly manager: Manager
  readonly match: Match
}

interface IMatchRoundsState {
  readonly selectedIndex: number
}

export class MatchRounds extends React.Component<IMatchRoundsProps, IMatchRoundsState> {
  constructor(props: IMatchRoundsProps) {
    super(props)

    this.state = { selectedIndex: 0 }
  }

  private renderTabs() {
    let tabs = []
    for (let index = 0; index < this.props.match.getCurrentRound(); index++) {
      const round = index + 1
      tabs.push(<span key={'round' + round.toString()}>第{round}轮</span>)
    }

    tabs.push(<span key={'nextround'}>下一轮</span>)

    return <div>{tabs}</div>
  }

  private renderActiveTabContents() {
    if (this.state.selectedIndex < this.props.match.getCurrentRound()) {
      return <RoundView manager={this.props.manager} match={this.props.match} round={this.state.selectedIndex + 1} />
    }

    return <NextRound manager={this.props.manager} match={this.props.match} />
  }

  public render() {
    if (this.props.match.getStatus() === MatchStatus.NotStarted) {
      return <div id="match-rounds">{this.renderNotStarted()}</div>
    } else {
      return (
        <div id="match-rounds">
          {this.renderTabs()}
          {this.renderActiveTabContents()}
        </div>
      )
    }
  }

  private renderNotStarted() {
    const numberOfPlayers = this.props.match.getPlayers().length
    const totalRounds = this.props.match.getTotalRounds()

    return (
      <div>
        <p className="summary">
          一共有{numberOfPlayers}位选手，计划进行{totalRounds}轮比赛
        </p>
        <Button type="submit" disabled={this.props.match.getTotalRounds() <= 0} onClick={this.startFirstRoundPairring}>
          安排第一轮对阵表
        </Button>
      </div>
    )
  }

  private startFirstRoundPairring = () => {
    this.props.manager.startFirstRoundPairring()
  }
}
