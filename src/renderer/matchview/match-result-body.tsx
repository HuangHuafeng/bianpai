import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { Player } from '../../common/immutable-player'

interface IMatchResultBodyProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IMatchResultBodyState {}

export class MatchResultBody extends React.PureComponent<IMatchResultBodyProps, IMatchResultBodyState> {
  constructor(props: IMatchResultBodyProps) {
    super(props)
  }

  public render() {
    return <tbody>{this.renderMatchResultBody()}</tbody>
  }

  private renderMatchResultBody() {
    const players = this.props.match.sortPlayers(this.props.match.playerList)
    let ret: any[] = []
    for (let index = 0; index < players.size; index++) {
      const player = players.get(index)
      ret.push(this.renderAPlayer(index + 1, player))
    }
    return ret
  }

  private renderAPlayer(place: number, player: Player) {
    const wins = player.playedResults.count(result => result === '+')
    const draws = player.playedResults.count(result => result === '=')
    const loses = player.playedResults.count(result => result === '-')
    const reds = player.playedSides.count(side => side === 'red')
    const blacks = player.playedSides.count(side => side === 'black')

    return (
      <tr key={place}>
        <th>{place}</th>
        <th>{player.number}</th>
        <th>{player.name}</th>
        <th>{player.organization}</th>
        <th>{player.score}</th>
        <th>{player.opponentScore}</th>
        <th>{wins}</th>
        <th>{draws}</th>
        <th>{loses}</th>
        <th>{reds}</th>
        <th>{blacks}</th>
      </tr>
    )
  }
}
