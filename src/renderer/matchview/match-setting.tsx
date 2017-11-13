import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { Button } from 'react-bootstrap'

interface IMatchSettingProps {
  readonly manager: Manager
  readonly match: Match
}

interface IMatchSettingState {}

export class MatchSetting extends React.Component<IMatchSettingProps, IMatchSettingState> {
  constructor(props: IMatchSettingProps) {
    super(props)
  }

  public render() {
    return (
      <div id="match-setting">
        <Button className="newmatch">计分规则</Button>
        <Button className="newmatch">参赛人员</Button>
        <Button className="newmatch">进入下一轮</Button>
      </div>
    )
  }
}
