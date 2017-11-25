import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch, MatchStatus } from '../../common/immutable-match'
import { RoundView } from './round-view'
import { Tabs, Tab, Button } from 'react-bootstrap'
import * as assert from 'assert'

interface IMatchRoundsProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchRoundsState {
  readonly selectedIndex: number
  readonly activeTab: number
}

export class MatchRounds extends React.PureComponent<IMatchRoundsProps, IMatchRoundsState> {
  constructor(props: IMatchRoundsProps) {
    super(props)

    this.state = { selectedIndex: 0, activeTab: 1 }
    console.log('MatchRounds constructed')
  }

  public componentWillReceiveProps?(nextProps: IMatchRoundsProps) {
    if (this.props.match.currentRound !== nextProps.match.currentRound) {
      this.handleSelect(nextProps.match.currentRound)
    }
  }

  private renderTabs() {
    let tabs = []
    for (let index = 0; index < this.props.match.totalRounds; index++) {
      const round = index + 1
      tabs.push(
        <Tab key={round} eventKey={round} title={'第' + round + '轮'}>
          <RoundView manager={this.props.manager} match={this.props.match} round={round} />
        </Tab>
      )
    }

    return tabs
  }

  private renderMessage() {
    const numberOfPlayers = this.props.match.playerList.size
    const totalRounds = this.props.match.totalRounds
    const currentRound = this.props.match.currentRound
    const matchStatus = this.props.match.status
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
    const currentRound = this.props.match.currentRound
    if (currentRound === 0) {
      assert.ok(MatchStatus.NotStarted === this.props.match.status, 'IMPOSSIBLE!')
      return (
        <Button bsStyle="primary" onClick={this.startMatch}>
          开始比赛
        </Button>
      )
    }

    return null
  }

  private handleSelect = (key: any) => {
    this.setState({ activeTab: key })
  }

  public render() {
    return (
      <div id="match-rounds">
        {this.renderMessage()}
        {this.renderStartMatch()}
        <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect} animation={false} id="round-content">
          {this.renderTabs()}
        </Tabs>
      </div>
    )
  }
}
