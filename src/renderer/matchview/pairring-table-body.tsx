import * as React from 'react'
import { Manager } from '../manager'
import { GameData } from '../../common/match'
import { Button } from 'react-bootstrap'

interface IPairringTableBodyProps {
  readonly manager: Manager
  readonly roundData: GameData[]
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
    for (let table of this.props.roundData) {
      ret.push(this.renderRow(table))
    }

    return ret
  }

  private renderRow(row: GameData) {
    return (
      <tr key={row.table}>
        <th>{row.table}</th>
        <th>{row.redPlayer.getNumber()}</th>
        <th>{row.redPlayer.getOrganization()}</th>
        <th>{row.redPlayer.getScore()}</th>
        <th>{row.redPlayer.getName()}</th>
        {this.renderResult(row)}
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getName()}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getScore()}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getOrganization()}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getNumber()}</th>
        {this.renderActions(row)}
      </tr>
    )
  }

  private renderResult(row: GameData) {
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

  private renderActions(row: GameData) {
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
