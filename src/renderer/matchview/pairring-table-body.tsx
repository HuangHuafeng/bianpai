import * as React from 'react'
import { Button } from 'react-bootstrap'
import { ImmutableMatch } from '../../common/immutable-match'
import { Round } from '../../common/immutable-round'
import { Game } from '../../common/immutable-game'

interface IPairringTableBodyProps {
  readonly roundData: Round
  readonly match: ImmutableMatch
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
    this.props.roundData.games.forEach(table => {
      ret.push(this.renderRow(table))
    })

    return ret
  }

  private renderRow(row: Game | undefined) {
    if (row) {
      const redPlayer = this.props.match.getPlayerByNumber(row.redNumber)
      const blackPlayer = this.props.match.getPlayerByNumber(row.blackNumber)
      return (
        <tr key={row.table.toString() + row.redNumber + row.blackNumber}>
          <th>{row.table}</th>
          <th>{row.redNumber}</th>
          <th>{redPlayer ? redPlayer.organization : ''}</th>
          <th>{redPlayer ? '' : ''}</th>
          <th>{redPlayer ? redPlayer.name : ''}</th>
          {this.renderResult(row)}
          <th>{blackPlayer ? blackPlayer.name : ''}</th>
          <th>{blackPlayer ? '' : ''}</th>
          <th>{blackPlayer ? blackPlayer.organization : ''}</th>
          <th>{row.blackNumber}</th>
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
