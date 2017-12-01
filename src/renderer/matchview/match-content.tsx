import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { PlayerTable } from './player-table'
import { MatchRounds } from './match-rounds'
import { MatchResult } from './match-result'
import { Tabs, Tab } from 'react-bootstrap'
import { Test } from '../test'
import { sendMenuEvent } from '../../common/menu-event'
import { debugLog } from '../../common/helper-functions'

const TabEditMatch: string = 'editmatch'

interface IMatchContentProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchContentState {
  readonly activeTab: number
}

export class MatchContent extends React.Component<IMatchContentProps, IMatchContentState> {
  constructor(props: IMatchContentProps) {
    super(props)
    debugLog('MatchContent constructed')

    this.state = { activeTab: 2 }
  }

  private handleSelect = (key: any) => {
    if (key === TabEditMatch) {
      this.showEditMatchDialog()
    }
    this.setState({ activeTab: key })
  }

  private showEditMatchDialog() {
    sendMenuEvent('edit-match')
  }

  /**
   * it seems setting "animation={false}" causes the Tabs to be a uncontrolled React component
   * Tabs with animation seems update multiple times. This requires its childrens to be smart
   * to know when no need to render.
   * For now, we use "animation={false}" with Tabs
   */
  public render() {
    let tabs = []
    tabs.push(<Tab eventKey={TabEditMatch} title="比赛设置" key={TabEditMatch} />)
    tabs.push(
      <Tab eventKey={2} title="选手管理" key="manageplayers">
        <PlayerTable manager={this.props.manager} match={this.props.match} />
      </Tab>
    )
    tabs.push(
      <Tab eventKey={3} title="轮次管理" key="managerounds">
        <MatchRounds manager={this.props.manager} match={this.props.match} />
      </Tab>
    )
    tabs.push(
      <Tab eventKey={4} title="比赛排名" key="playersranking">
        <MatchResult manager={this.props.manager} match={this.props.match} />
      </Tab>
    )
    if (__DEV__) {
      tabs.push(
        <Tab eventKey={5} title="测试" key="test">
          <Test manager={this.props.manager} match={this.props.match} />
        </Tab>
      )
    }

    return (
      <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect} animation={false} id="match-content">
        {tabs}
      </Tabs>
    )
  }
}
