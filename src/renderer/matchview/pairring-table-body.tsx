import * as React from 'react'
import { Manager } from '../manager'
import { GameData } from '../../common/match'
import { Button } from 'react-bootstrap'

interface IPairringTableBodyProps {
  readonly manager: Manager
  readonly roundData: GameData[]
  readonly modify?: boolean
  readonly setGameResult?: (table: number, result: string) => void
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
    const result = this.renderResult(row)

    return (
      <tr key={'table' + row.table}>
        <th>{row.table}</th>
        <th>{row.redPlayer.getNumber()}</th>
        <th>{row.redPlayer.getOrganization()}</th>
        <th> </th>
        <th>{row.redPlayer.getName()}</th>
        <th>{result}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getName()}</th>
        <th> </th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getOrganization()}</th>
        <th>{row.blackPlayer === undefined ? '' : row.blackPlayer.getNumber()}</th>
      </tr>
    )
  }

  private renderResult(row: GameData) {
    let result = []
    if (row.result === '+') {
      result.push(<p key="result">胜</p>)
    } else if (row.result === '-') {
      result.push(<p key="result">负</p>)
    } else if (row.result === '=') {
      result.push(<p key="result">和</p>)
    } else {
      result.push(<p key="result">*</p>)
    }

    if (this.props.modify === true) {
      result.push(
        <Button key="win" bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '+')}>
          红胜
        </Button>
      )
      result.push(
        <Button key="draw" bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '=')}>
          和棋
        </Button>
      )
      result.push(
        <Button key="lose" bsSize="xsmall" bsStyle="warning" onClick={() => this.setTableResult(row.table, '-')}>
          黒胜
        </Button>
      )
    }

    return result
  }

  private setTableResult = (table: number, result: string) => {
    if (this.props.setGameResult) {
      this.props.setGameResult(table, result)
    }
  }
}
