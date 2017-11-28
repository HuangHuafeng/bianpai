import * as React from 'react'
import * as Electron from 'electron'
import { Manager } from '../manager'

interface IMatchFooterProps {
  readonly manager: Manager
}

interface IMatchFooterState {}

export class MatchFooter extends React.PureComponent<IMatchFooterProps, IMatchFooterState> {
  constructor(props: IMatchFooterProps) {
    super(props)
  }

  public render() {
    const match = this.props.manager.getMatch()
    const appName = Electron.remote.app.getName()
    return (
      <div id="match-footer">
        <p>
          裁判长：{match.judge}&nbsp;&nbsp;&nbsp;&nbsp;编排长：{match.arranger}&nbsp;&nbsp;&nbsp;&nbsp;编排软件：{appName}
        </p>
      </div>
    )
  }
}
