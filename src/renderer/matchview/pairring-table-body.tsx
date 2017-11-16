import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Manager } from '../manager'
import { Round } from '../../common/immutable-round'
import { Game } from '../../common/immutable-game'

interface IPairringTableBodyProps {
  readonly manager: Manager
  readonly roundData: Round
  readonly updatable?: boolean
  readonly updateCallback?: (table: number, result: string) => void
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
    let ret = []
    for (let table of this.props.roundData.toArray()) {
      ret.push(this.renderRow(table))
    }

    return ret
  }

  private renderRow(row: Game) {
    return (
      <tr key={row.table}>
        <th>{row.table}</th>
        <th>{row.redNumber}</th>
        <th>{row.redNumber}</th>
        <th>{row.redNumber}</th>
        <th>{row.redNumber}</th>
        {this.renderResult(row)}
        <th>{row.blackNumber}</th>
        <th>{row.blackNumber}</th>
        <th>{row.blackNumber}</th>
        <th>{row.blackNumber}</th>
        {this.renderActions(row)}
      </tr>
    )
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
