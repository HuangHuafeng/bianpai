import * as React from 'react'
import { Table } from 'react-bootstrap'
import { Round } from '../../common/immutable-round'
import { Game } from '../../common/immutable-game'

interface IFinishedTableProps {
  readonly roundData: Round
  readonly dontShowResult?: boolean
}

interface IFinishedTableState {}

export class FinishedTable extends React.PureComponent<IFinishedTableProps, IFinishedTableState> {
  constructor(props: IFinishedTableProps) {
    super(props)
  }

  public render() {
    return (
      <Table striped bordered condensed hover responsive>
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
        </tr>
      )
    } else {
      throw new Error('UNEXPECTED!')
    }
  }

  private renderResult(row: Game) {
    if (this.props.dontShowResult) {
      return <th />
    }

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
}
