import * as React from 'react'
import { Manager } from '../manager'
import { ImmutableMatch, MatchStatus } from '../../common/immutable-match'
import { Player } from '../../common/immutable-player'
import { Button, Table } from 'react-bootstrap'
import { SupportedPrintContentType } from '../print-view'
import { debugLog } from '../../common/helper-functions'

interface IMatchResultProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
  readonly printing?: boolean
}

interface IMatchResultState {}

export class MatchResult extends React.PureComponent<IMatchResultProps, IMatchResultState> {
  constructor(props: IMatchResultProps) {
    super(props)
    debugLog('MatchResult constructed')
  }
  private printPairingToPDF = () => {
    this.props.manager.print({ type: SupportedPrintContentType.PlayerRanking })
  }

  public render() {
    // add responsive to Table causes print issues
    return (
      <div id="match-result">
        <div id="match-result-status-and-actions">
          <p>
            {this.renderMessage()}
            <br />
            {this.renderActions()}
          </p>
        </div>
        <Table striped bordered condensed hover>
          <thead>{this.renderTableHead()}</thead>
          <tbody>{this.renderTableBody()}</tbody>
        </Table>
      </div>
    )
  }

  private renderActions() {
    if (this.props.printing) {
      return null
    }

    return (
      <Button bsStyle="primary" onClick={this.printPairingToPDF}>
        打印
      </Button>
    )
  }

  private renderTableHead() {
    return (
      <tr>
        <th>名次</th>
        <th>编号</th>
        <th>姓名</th>
        <th>单位</th>
        <th>总分</th>
        <th>对手分</th>
        <th>胜</th>
        <th>和</th>
        <th>负</th>
        <th>先手数</th>
        <th>后手数</th>
      </tr>
    )
  }

  private renderTableBody() {
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

  private renderMessage() {
    let message
    if (this.props.match.status === MatchStatus.Finished) {
      message = '比赛结束，最终排名如下'
    } else if (this.props.match.status === MatchStatus.NotStarted) {
      message = '比赛还没有开始，参加比赛的选手如下'
    } else {
      message = `正在进行第${this.props.match.currentRound}轮，即时排名如下`
    }

    return message
  }
}
