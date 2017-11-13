import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'

interface IMatchFooterProps {
  readonly manager: Manager
  readonly match: Match
}

interface IMatchFooterState {}

export class MatchFooter extends React.Component<IMatchFooterProps, IMatchFooterState> {
  constructor(props: IMatchFooterProps) {
    super(props)
  }

  public render() {
    return (
      <div id="match-footer">
        <p>裁判长：小钢炮</p>
      </div>
    )
  }
}
