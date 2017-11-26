import * as React from 'react'
import { Manager, PopupType } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { PlayerTable } from './player-table'
import { MatchRounds } from './match-rounds'
import { MatchResult } from './match-result'
import { Tabs, Tab } from 'react-bootstrap'
import { Test } from '../test'
import { EditMatch } from '../edit-match'

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

    const lastPrintContent = props.manager.getLastPrintContent()
    let activeTab: number = 2
    if (lastPrintContent) {
      if (lastPrintContent.type === 'pairing-match-result') {
        activeTab = 4
      } else if (lastPrintContent.type === 'round-result' || lastPrintContent.type === 'round-pairing') {
        activeTab = 3
      }
    }
    this.state = { activeTab }
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
          <EditMatch
            key="editmatch"
            onDismissed={() => {
              this.props.manager.onPopupDismissed(PopupType.EditMatch)
            }}
            manager={this.props.manager}
            match={this.props.match}
          />
        </Tab>
        <Tab eventKey={2} title="选手管理">
          <PlayerTable manager={this.props.manager} match={this.props.match} />
        </Tab>
        <Tab eventKey={3} title="轮次管理">
          <MatchRounds manager={this.props.manager} match={this.props.match} />
        </Tab>
        <Tab eventKey={4} title="比赛排名">
          <MatchResult manager={this.props.manager} match={this.props.match} />
        </Tab>
        <Tab eventKey={5} title="测试">
          <Test manager={this.props.manager} match={this.props.match} />
        </Tab>
      </Tabs>
    )
  }
}
