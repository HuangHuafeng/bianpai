import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'

interface IMatchFooterProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchFooterState {}

export class MatchFooter extends React.PureComponent<IMatchFooterProps, IMatchFooterState> {
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
