import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { debugLog } from '../../common/helper-functions'

interface IMatchHeaderProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchHeaderState {}

export class MatchHeader extends React.PureComponent<IMatchHeaderProps, IMatchHeaderState> {
  constructor(props: IMatchHeaderProps) {
    super(props)
    debugLog('MatchHeader constructed')
  }

  public render() {
    return (
      <div id="match-header">
        <h1>{this.props.match.name}</h1>
        <h3>{this.props.match.organizer}</h3>
      </div>
    )
  }
}
