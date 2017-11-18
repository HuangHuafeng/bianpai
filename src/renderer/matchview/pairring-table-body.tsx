import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Round } from '../../common/immutable-round'
import { Game } from '../../common/immutable-game'

interface IPairringTableBodyProps {
  readonly roundData: Round
  readonly updatable?: boolean
  readonly updateCallback?: (table: number, result: string) => void
}

interface IPairringTableBodyState {}

export class PairringTableBody extends React.PureComponent<IPairringTableBodyProps, IPairringTableBodyState> {
  constructor(props: IPairringTableBodyProps) {
    super(props)
  }

  public render() {
    return <tbody>{this.renderPairringTableBody()}</tbody>
  }

  private renderPairringTableBody() {
    let ret: any[] = []
    this.props.roundData.games.forEach(game => {
      ret.push(this.renderRow(game))
    })

    return ret
  }

  private renderRow(row: Game | undefined) {
    if (row) {
      return (
        <tr key={row.table.toString()}>
          <th>{row.table}</th>
          <th>{row.redPlayer.number}</th>
          <th>{row.redPlayer.organization}</th>
          <th>{row.redPlayer.score}</th>
          <th>{row.redPlayer.name}</th>
          {this.renderResult(row)}
          <th>{row.blackPlayer.name}</th>
          <th>{row.blackPlayer.score}</th>
          <th>{row.blackPlayer.organization}</th>
          <th>{row.blackPlayer.number}</th>
          {this.renderActions(row)}
        </tr>
      )
    }

    console.log('undefined game')

    return null
  }

  private renderResult(row: Game) {
    let gameResult
    if (row.result === '+') {
      gameResult = '胜'
    } else if (row.result === '-') {
      gameResult = '负'
    } else if (row.result === '=') {
      gameResult = '和'
    } else {
      gameResult = '*'
    }

    return <th>{gameResult}</th>
  }

  private renderActions(row: Game) {
    if (this.props.updatable === true) {
      const actions = (
        <th>
          <Button bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '+')}>
            红胜
          </Button>
          <Button bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '=')}>
            和棋
          </Button>
          <Button bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '-')}>
            黒胜
          </Button>
          <Button bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '?')}>
            未知
          </Button>
        </th>
      )

      return actions
    }

    return null
  }

  private setTableResult = (table: number, result: string) => {
    if (this.props.updateCallback) {
      this.props.updateCallback(table, result)
    }
  }
}
