import * as React from 'react'
import { Button, Table } from 'react-bootstrap'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { Player } from '../../common/immutable-player'
import { sendMenuEvent } from '../../common/menu-event'

interface IPlayerTableProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IPlayerTableState {}

export class PlayerTable extends React.PureComponent<IPlayerTableProps, IPlayerTableState> {
  constructor(props: IPlayerTableProps) {
    super(props)
  }

  public render() {
    const numberOfPlayers = this.props.match.playerList.size

    return (
      <div id="players">
        <div id="players-modify">
          <p className="summary">选手总数：{numberOfPlayers}</p>
          <Button onClick={() => sendMenuEvent('add-player')} disabled={this.props.match.disallowUpdatePlayers()}>
            增加选手
          </Button>
          <Button
            bsStyle="danger"
            onClick={() => sendMenuEvent('remove-all-players')}
            disabled={this.props.match.disallowUpdatePlayers()}
          >
            全部删除
          </Button>
        </div>
        <div id="players-list">
          <Table striped bordered condensed hover responsive>
            <thead>{this.renderTableHead()}</thead>
            <tbody>{this.renderTableBody()}</tbody>
          </Table>
        </div>
      </div>
    )
  }

  private renderTableHead() {
    return (
      <tr>
        <th>编号</th>
        <th>姓名</th>
        <th>单位</th>
        <th>操作</th>
      </tr>
    )
  }

  private renderTableBody() {
    const players = this.props.match.playerList
    let ret: any[] = []
    for (let index = 0; index < players.size; index++) {
      const player = players.get(index)
      ret.push(this.renderAPlayer(player))
    }
    return ret
  }

  private removePlayer(number: number) {
    this.props.manager.removePlayer(number)
  }

  private editPlayer(number: number) {
    this.props.manager.editPlayer(number)
  }

  private renderAPlayer(player: Player) {
    return (
      <tr key={player.number}>
        <th>{player.number}</th>
        <th>{player.name}</th>
        <th>{player.organization}</th>
        <th>
          <Button
            bsSize="xsmall"
            onClick={() => this.editPlayer(player.number)}
            disabled={this.props.match.disallowUpdatePlayers()}
          >
            编辑
          </Button>
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={() => this.removePlayer(player.number)}
            disabled={this.props.match.disallowUpdatePlayers()}
          >
            删除
          </Button>
        </th>
      </tr>
    )
  }
}
