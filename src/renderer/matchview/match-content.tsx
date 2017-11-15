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

interface IMatchContentState {
  readonly activeTab: number
}

export class MatchContent extends React.Component<IMatchContentProps, IMatchContentState> {
  constructor(props: IMatchContentProps) {
    super(props)

    this.state = { activeTab: 2 }
  }

  private handleSelect = (key: any) => {
    this.setState({ activeTab: key })
  }

  /**
   * it seems setting "animation={false}" causes the Tabs to be a uncontrolled React component
   * Tabs with animation seems update multiple times. This requires its childrens to be smart
   * to know when no need to render.
   * For now, we use "animation={false}" with Tabs
   */
  public render() {
    return (
      <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect} animation={false} id="match-content">
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
