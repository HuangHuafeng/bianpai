import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { PairringTableHeader } from './pairring-table-header'
import { PairringTableBody } from './pairring-table-body'
import { Table } from 'react-bootstrap'

interface IRoundViewProps {
  readonly manager: Manager
  readonly match: Match
  readonly round: number
}

interface IRoundViewState {}

export class RoundView extends React.Component<IRoundViewProps, IRoundViewState> {
  constructor(props: IRoundViewProps) {
    super(props)
  }

  public render() {
    return (
      <div key={'round' + this.props.round}>
        第{this.props.round}轮的数据
        <Table striped bordered condensed hover responsive>
          <PairringTableHeader manager={this.props.manager} />
          <PairringTableBody manager={this.props.manager} match={this.props.match} />
        </Table>
      </div>
    )
  }
}
