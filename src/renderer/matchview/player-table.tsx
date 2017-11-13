import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { PlayerTableHeader } from './player-table-header'
import { PlayerTableBody } from './player-table-body'
import { sendMenuEvent } from '../../common/menu-event'
import { Button, Table } from 'react-bootstrap'

interface IPlayerTableProps {
  readonly manager: Manager
  readonly match: Match
}

interface IPlayerTableState {}

export class PlayerTable extends React.Component<IPlayerTableProps, IPlayerTableState> {
  constructor(props: IPlayerTableProps) {
    super(props)
  }

  public render() {
    const numberOfPlayers = this.props.match.getPlayers().length

    return (
      <div id="players">
        <div id="players-modify">
          <p className="summary">选手总数：{numberOfPlayers}</p>
          <Button onClick={() => sendMenuEvent('add-player')}>增加选手</Button>
          <Button bsStyle="danger" onClick={() => sendMenuEvent('remove-all-players')} disabled={numberOfPlayers === 0}>
            全部删除
          </Button>
        </div>
        <div id="players-list">
          <Table striped bordered condensed hover responsive>
            <PlayerTableHeader manager={this.props.manager} />
            <PlayerTableBody manager={this.props.manager} match={this.props.match} />
          </Table>
        </div>
      </div>
    )
  }
}