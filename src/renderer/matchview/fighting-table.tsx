import * as React from 'react'
import { Button, Table } from 'react-bootstrap'
import { Round } from '../../common/immutable-round'
import { Game } from '../../common/immutable-game'

interface IFightingTableProps {
  readonly roundData: Round
  readonly updateCallback: (table: number, result: string) => void
}

interface IFightingTableState {}

export class FightingTable extends React.PureComponent<IFightingTableProps, IFightingTableState> {
  constructor(props: IFightingTableProps) {
    super(props)
  }

  public render() {
    // add responsive to Table causes print issues
    return (
      <Table striped bordered condensed hover>
        <thead>{this.renderTableHead()}</thead>
        <tbody>{this.renderTableBody()}</tbody>
      </Table>
    )
  }

  private renderTableHead() {
    return (
      <tr>
        <th>台号</th>
        <th>编号</th>
        <th>红方单位</th>
        <th>积分</th>
        <th>红方姓名</th>
        <th>结果</th>
        <th>黑方姓名</th>
        <th>积分</th>
        <th>黑方单位</th>
        <th>编号</th>
        <th>结果</th>
      </tr>
    )
  }

  private renderTableBody() {
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
    } else {
      throw new Error('UNEXPECTED!')
    }
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
      gameResult = ''
    }

    return <th>{gameResult}</th>
  }

  private renderActions(row: Game) {
    const actions = (
      <th>
        <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.setTableResult(row.table, '+')}>
          红胜
        </Button>
        <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.setTableResult(row.table, '=')}>
          和棋
        </Button>
        <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.setTableResult(row.table, '-')}>
          黒胜
        </Button>
        <Button bsSize="xsmall" bsStyle="primary" onClick={() => this.setTableResult(row.table, '?')}>
          未知
        </Button>
      </th>
    )

    return actions
  }

  private setTableResult = (table: number, result: string) => {
    this.props.updateCallback(table, result)
  }
}
