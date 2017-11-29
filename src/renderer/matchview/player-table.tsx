import * as React from 'react'
import { Button, Table } from 'react-bootstrap'
import * as XLSX from 'xlsx'
import * as Electron from 'electron'
import { Manager } from '../manager'
import { ImmutableMatch } from '../../common/immutable-match'
import { Player } from '../../common/immutable-player'
import { sendMenuEvent } from '../../common/menu-event'
import { findSheet, findTable, readTable } from '../../common/xlsx-helper'
import { debugLog } from '../../common/helper-functions'

interface IPlayerTableProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface IPlayerTableState { }

export class PlayerTable extends React.PureComponent<IPlayerTableProps, IPlayerTableState> {
  constructor(props: IPlayerTableProps) {
    super(props)
  }

  public render() {
    const numberOfPlayers = this.props.match.playerList.size
    const disabled = this.props.match.disallowUpdatePlayers()

    // add responsive to Table causes print issues
    return (
      <div id="players">
        <div id="players-modify">
          <p className="summary">选手总数：{numberOfPlayers}</p>
          <Button bsStyle="primary" onClick={() => sendMenuEvent('add-player')} disabled={disabled}>
            增加选手
          </Button>
          <Button bsStyle="danger" onClick={() => sendMenuEvent('remove-all-players')} disabled={disabled}>
            全部删除
          </Button>
          <Button bsStyle="primary" onClick={this.importPlayersFromFile} disabled={disabled}>
            从文件导入选手
          </Button>
          <Button bsStyle="primary" onClick={this.exportPlayersToFile} disabled={disabled}>
            导出选手到文件
          </Button>
        </div>
        <div id="players-list">
          <Table striped bordered condensed hover>
            <thead>{this.renderTableHead()}</thead>
            <tbody>{this.renderTableBody()}</tbody>
          </Table>
        </div>
      </div>
    )
  }

  private renderTableHead() {
    return (
      <tr>
        <th>编号</th>
        <th>姓名</th>
        <th>单位</th>
        <th>备注</th>
        <th>操作</th>
      </tr>
    )
  }

  private renderTableBody() {
    const players = this.props.match.playerList
    let ret: any[] = []
    for (let index = 0; index < players.size; index++) {
      const player = players.get(index)
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

  private importPlayersFromFile = (): void => {
    /* show a file-open dialog and read the first selected file */
    var fileNames = Electron.remote.dialog.showOpenDialog(Electron.remote.getCurrentWindow(), {
      properties: ['openFile'],
      filters: [{ name: 'Excel 文件', extensions: ['xls', 'xlsx', 'csv'] }],
    })
    if (fileNames) {
      this.parseFileAndImportPlayers(fileNames[0])
    }
  }

  private parseFileAndImportPlayers(fileName: string) {
    var workbook = XLSX.readFile(fileName)
    const sheetName = workbook.SheetNames[0]
    let { sheet, range } = findSheet(workbook, sheetName)

    if (sheet === null) {
      return
    }

    let { columns, firstRow } = findTable(sheet, range, {
      number: '编号',
      name: '姓名',
      organization: '单位',
      note: '备注',
    })

    if (firstRow === null) {
      // cannot find the table!!!
      return
    }

    const data = readTable(sheet, range, columns, firstRow)

    data.forEach((player, index) => {
      if (player.name !== null) {
        const name = player.name
        const number = player.number !== null ? player.number : 0
        const organization = player.organization !== null ? player.organization : ''
        const note = player.note !== null ? player.note : ''

        // name, number are all unique in the match!!! only add the player if s/he is not in the match
        if (this.props.match.getPlayerByName(name) === undefined) {
          this.props.manager.addPlayer(name, organization, note, number)
        }
      } else {
        debugLog('player does not have a name, so cannot be added')
      }
    })
  }

  private exportPlayersToFile = (): void => {
    const options = {
      filters: [{ name: 'Excel 文件', extensions: ['xlsx', 'xls', 'csv'] }],
    }
    /* show a file-open dialog and read the first selected file */
    var fileName = Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), options)
    if (fileName) {
      this.savePlayersToFile(fileName)
    }
  }

  private savePlayersToFile(fileName: string) {
    let playersArrayOfArray: any = []
    playersArrayOfArray.push(['编号', '姓名', '单位', '备注'])
    const playerList = this.props.match.playerList
    playerList.forEach(player => {
      if (player) {
        let row = []
        row.push(player.number)
        row.push(player.name)
        row.push(player.organization)
        row.push(player.note)
        playersArrayOfArray.push(row)
      }
    })
    var ws = XLSX.utils.aoa_to_sheet(playersArrayOfArray)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws)

    XLSX.writeFile(wb, fileName)
  }

  private renderAPlayer(player: Player) {
    const disabled = this.props.match.disallowUpdatePlayers()
    return (
      <tr key={player.number}>
        <th>{player.number}</th>
        <th>{player.name}</th>
        <th>{player.organization}</th>
        <th>{player.note}</th>
        <th>
          <Button bsStyle="primary" bsSize="xsmall" onClick={() => this.editPlayer(player.number)} disabled={disabled}>
            编辑
          </Button>
          <Button bsSize="xsmall" bsStyle="danger" onClick={() => this.removePlayer(player.number)} disabled={disabled}>
            删除
          </Button>
        </th>
      </tr>
    )
  }
}
