import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { Player } from '../../common/immutable-player'
import { Button } from 'react-bootstrap'

interface IPlayerTableBodyProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IPlayerTableBodyState {}

export class PlayerTableBody extends React.PureComponent<IPlayerTableBodyProps, IPlayerTableBodyState> {
  constructor(props: IPlayerTableBodyProps) {
    super(props)
  }

  public render() {
    return <tbody>{this.renderPlayerTableBody()}</tbody>
  }

  private renderPlayerTableBody() {
    const players = this.props.match.players.toArray()
    let ret: any[] = []
    for (let player of players) {
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
          <Button bsSize="xsmall" onClick={() => this.editPlayer(player.number)}>
            编辑
          </Button>
          <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.removePlayer(player.number)}>
            删除
          </Button>
        </th>
      </tr>
    )
  }
}
