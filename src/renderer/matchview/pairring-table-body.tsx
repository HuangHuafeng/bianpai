import * as React from 'react'
import { Manager } from '../manager'
import { Match } from '../../common/match'
import { GameData } from '../../common/match'

interface IPairringTableBodyProps {
  readonly manager: Manager
  readonly match: Match
}

interface IPairringTableBodyState {}

export class PairringTableBody extends React.Component<IPairringTableBodyProps, IPairringTableBodyState> {
  constructor(props: IPairringTableBodyProps) {
    super(props)
  }

  public render() {
    return <tbody>{this.renderPairringTableBody()}</tbody>
  }

  private renderPairringTableBody() {
    let currentRound = this.props.match.getCurrentRound()
    let currentRoundData: GameData[] = this.props.match.getRoundData(currentRound)
    let ret = []
    for (let game of currentRoundData) {
      ret.push(this.renderRow(game))
    }

    return ret
  }

  private renderRow(row: GameData) {
    return (
      <tr key={'table' + row.table}>
        <th>{row.table}</th>
        <th>{row.redPlayer.getNumber()}</th>
        <th>{row.redPlayer.getOrganization()}</th>
        <th> </th>
        <th>{row.redPlayer.getName()}</th>
        <th>{row.result}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getName()}</th>
        <th> </th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getOrganization()}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getNumber()}</th>
      </tr>
    )
  }
}
