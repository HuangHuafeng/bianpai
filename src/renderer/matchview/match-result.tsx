import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch, MatchStatus } from '../../common/immutable-match'
import { MatchResultHeader } from './match-result-header'
import { MatchResultBody } from './match-result-body'
import { Table } from 'react-bootstrap'

interface IMatchResultProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchResultState {}

export class MatchResult extends React.PureComponent<IMatchResultProps, IMatchResultState> {
  constructor(props: IMatchResultProps) {
    super(props)
  }

  public render() {
    return (
      <div id="match-result">
        {this.renderMessage()}
        <Table striped bordered condensed hover responsive>
          <MatchResultHeader />
          <MatchResultBody manager={this.props.manager} match={this.props.match} />
        </Table>
      </div>
    )
  }

  private renderMessage() {
    let message
    if (this.props.match.status === MatchStatus.Finished) {
      message = '比赛结束，最终排名如下'
    } else {
      message = '比赛还没有结束，即时排名如下'
    }

    return <p className="summary">{message}</p>
  }
}
