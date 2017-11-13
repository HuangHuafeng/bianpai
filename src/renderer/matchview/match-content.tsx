import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { PlayerTable } from './player-table'
import { MatchRounds } from './match-rounds'
import { Tabs, Tab } from 'react-bootstrap'

interface IMatchContentProps {
  readonly manager: Manager
  readonly match: Match
}

interface IMatchContentState {}

export class MatchContent extends React.Component<IMatchContentProps, IMatchContentState> {
  constructor(props: IMatchContentProps) {
    super(props)
  }

  public render() {
    return (
      <Tabs id="match-content">
        <Tab eventKey={1} title="比赛设置">
          Tab 1 content
        </Tab>
        <Tab eventKey={2} title="选手管理">
          <PlayerTable manager={this.props.manager} match={this.props.match} />
        </Tab>
        <Tab eventKey={3} title="轮次管理">
          <MatchRounds manager={this.props.manager} match={this.props.match} />
        </Tab>
      </Tabs>
    )
  }
}
