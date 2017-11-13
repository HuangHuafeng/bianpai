import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { RoundView } from './round-view'
import { Tabs, Tab } from 'react-bootstrap'

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

  public render() {
    const numberOfPlayers = this.props.match.getPlayers().length
    const totalRounds = this.props.match.getTotalRounds()

    return (
      <div id="match-rounds">
        <p className="summary">
          一共有{numberOfPlayers}位选手，进行{totalRounds}轮比赛
        </p>
        <Tabs id="round-content">{this.renderTabs()}</Tabs>
      </div>
    )
  }
}
