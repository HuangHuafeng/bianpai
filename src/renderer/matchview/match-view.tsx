import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { sendMenuEvent } from '../../common/menu-event'
import { MatchHeader } from './match-header'
import { MatchFooter } from './match-footer'
import { MatchContent } from './match-content'
import { Button } from 'react-bootstrap'

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
        <MatchFooter manager={this.props.manager} match={this.props.match} />
      </div>
    )
  }

  private renderNewMatch() {
    return (
      <div id="match">
        <Button bsSize="large" className="btn btn-lg btn-primary" onClick={() => sendMenuEvent('file-new')}>
          创建比赛
        </Button>
      </div>
    )
  }
}
