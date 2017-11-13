import * as React from 'react'
import { Manager } from '../manager'
import { Match, MatchStatus } from '../../common/match'
import * as assert from 'assert'

interface INextRoundProps {
  readonly manager: Manager
  readonly match: Match
}

interface INextRoundState {}

export class NextRound extends React.Component<INextRoundProps, INextRoundState> {
  constructor(props: INextRoundProps) {
    super(props)
  }

  public render() {
    switch (this.props.match.getStatus()) {
      case MatchStatus.Finished:
        return this.renderFinished()

      case MatchStatus.OnGoingPairring:
        return this.renderPairring()

      case MatchStatus.OnGoingFighting:
        return this.renderFighting()

      case MatchStatus.NotStarted:
        assert.ok(false, 'IMPOSSIBLE! match is still in not started!')
        return null

      default:
        assert.ok(false, 'IMPOSSIBLE! Unknown match status!')
        return null
    }
  }

  private renderFinished() {
    return <p>比赛已经结束了</p>
  }

  private renderPairring() {
    return <p>正在配对</p>
  }

  private renderFighting() {
    return <p>正在进行</p>
  }
}
