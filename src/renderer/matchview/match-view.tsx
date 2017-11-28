import * as React from 'react'
import { Manager } from '../manager'
import { Button } from 'react-bootstrap'
import { ImmutableMatch } from '../../common/immutable-match'
import { sendMenuEvent } from '../../common/menu-event'
import { MatchHeader } from './match-header'
import { MatchFooter } from './match-footer'
import { MatchContent } from './match-content'

interface IMatchViewProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchViewState {}

export class MatchView extends React.Component<IMatchViewProps, IMatchViewState> {
  constructor(props: IMatchViewProps) {
    super(props)
  }

  public render() {
    if (this.props.match.name === '') {
      // a match with empty name is a fake match object
      return this.renderNewMatch()
    }

    return (
      <div id="match">
        <MatchHeader manager={this.props.manager} match={this.props.match} />
        <MatchContent manager={this.props.manager} match={this.props.match} />
        <MatchFooter manager={this.props.manager} />
      </div>
    )
  }

  private renderNewMatch() {
    return (
      <div id="match">
        <Button bsStyle="primary" bsSize="large" onClick={() => sendMenuEvent('file-new')}>
          创建比赛
        </Button>
        <Button bsStyle="primary" bsSize="large" onClick={() => sendMenuEvent('file-open')}>
          打开比赛
        </Button>
      </div>
    )
  }
}
