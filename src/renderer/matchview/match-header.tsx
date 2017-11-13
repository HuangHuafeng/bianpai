import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'

interface IMatchHeaderProps {
  readonly manager: Manager
  readonly match: Match
}

interface IMatchHeaderState {}

export class MatchHeader extends React.Component<IMatchHeaderProps, IMatchHeaderState> {
  constructor(props: IMatchHeaderProps) {
    super(props)
  }

  public render() {
    return (
      <div id="match-header">
        <h1>{this.props.match.getName()}</h1>
        <h3>{this.props.match.getOrganizer()}</h3>
      </div>
    )
  }
}
