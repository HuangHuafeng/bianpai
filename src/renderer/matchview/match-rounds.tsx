import * as React from 'react'
import { Manager } from '../manager'
import { Match, MatchStatus } from '../../common/match'
import { RoundView } from './round-view'
import { Tabs, Tab, Button } from 'react-bootstrap'
import * as assert from 'assert'

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
    for (let index = 0; index < this.props.match.getTotalRounds(); index++) {
      tabs.push(
        <Tab key={'match round ' + (index + 1)} eventKey={index} title={'第' + (index + 1) + '轮'}>
          <RoundView manager={this.props.manager} match={this.props.match} round={index + 1} />
        </Tab>
      )
    }

    return tabs
  }

  private renderMessage() {
    const numberOfPlayers = this.props.match.getPlayers().length
    const totalRounds = this.props.match.getTotalRounds()
    const currentRound = this.props.match.getCurrentRound()
    const matchStatus = this.props.match.getStatus()
    let message = `一共有${numberOfPlayers}位选手，`
    switch (matchStatus) {
      case MatchStatus.NotStarted:
        message += `将进行${totalRounds}轮比赛`
        break

      case MatchStatus.OnGoingPairing:
        message += `共${totalRounds}轮比赛，正在准备第${currentRound}轮的对阵表`
        break

      case MatchStatus.OnGoingFighting:
        message += `共${totalRounds}轮比赛，正在进行第${currentRound}轮比赛`
        break

      case MatchStatus.Finished:
        message += `完成了${totalRounds}轮比赛，比赛结束`
        break

      default:
        throw new Error('IMPOSSIBLE! match in illeagal status!')
    }

    return <p className="summary">{message}</p>
  }

  private startMatch = () => {
    this.props.manager.startMatch()
  }

  private renderStartMatch() {
    const currentRound = this.props.match.getCurrentRound()
    if (currentRound === 0) {
      assert.ok(MatchStatus.NotStarted === this.props.match.getStatus(), 'IMPOSSIBLE!')
      return (
        <Button bsStyle="primary" onClick={this.startMatch}>
          开始比赛
        </Button>
      )
    }

    return null
  }

  public render() {
    return (
      <div id="match-rounds">
        {this.renderMessage()}
        {this.renderStartMatch()}
        <Tabs id="round-content">{this.renderTabs()}</Tabs>
      </div>
    )
  }
}
