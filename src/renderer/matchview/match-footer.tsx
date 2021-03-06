import * as React from 'react'
import * as Electron from 'electron'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { debugLog } from '../../common/helper-functions'

interface IMatchFooterProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchFooterState {}

export class MatchFooter extends React.PureComponent<IMatchFooterProps, IMatchFooterState> {
  constructor(props: IMatchFooterProps) {
    super(props)
    debugLog('MatchFooter constructed')
  }

  public render() {
    const match = this.props.match
    const appName = Electron.remote.app.getName()
    return (
      <div id="match-footer">
        <p>
          裁判长：{match.judge}&nbsp;&nbsp;&nbsp;&nbsp;编排长：{match.arranger}&nbsp;&nbsp;&nbsp;&nbsp;编排软件：{
            appName
          }
        </p>
      </div>
    )
  }
}
