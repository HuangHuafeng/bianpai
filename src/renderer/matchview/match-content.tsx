import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { PlayerTable } from './player-table'
import * as assert from 'assert'
import { MatchRounds } from './match-rounds'
import { sendMenuEvent } from '../../common/menu-event'
import { Button } from 'react-bootstrap'

enum MatchContentViews {
  Players = 1,
  Rounds,
}

interface IMatchContentProps {
  readonly manager: Manager
  readonly match: Match
}

interface IMatchContentState {
  readonly currentView: number
}

export class MatchContent extends React.Component<IMatchContentProps, IMatchContentState> {
  constructor(props: IMatchContentProps) {
    super(props)

    this.state = { currentView: MatchContentViews.Players }
  }

  private renderSettings() {
    return (
      <div id="match-setting">
        <Button className="matchsetting" onClick={() => sendMenuEvent('edit-match')}>
          比赛设置
        </Button>
        <Button className="matchsetting" onClick={this.onManagePlayers}>
          选手
        </Button>
        <Button className="matchsetting" onClick={this.onManageRounds}>
          轮次
        </Button>
      </div>
    )
  }

  private onManagePlayers = () => {
    this.setState({ currentView: MatchContentViews.Players })
  }

  private onManageRounds = () => {
    this.setState({ currentView: MatchContentViews.Rounds })
  }

  private renderActiveView() {
    switch (this.state.currentView) {
      case MatchContentViews.Players:
        return <PlayerTable manager={this.props.manager} match={this.props.match} />

      case MatchContentViews.Rounds:
        return <MatchRounds manager={this.props.manager} match={this.props.match} />

      default:
        return assert.ok(false, 'unknown tab content')
    }
  }

  public render() {
    return (
      <div id="match-content">
        {this.renderSettings()}
        {this.renderActiveView()}
      </div>
    )
  }
}
