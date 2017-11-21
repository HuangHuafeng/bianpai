import * as React from 'react'
import * as Immutable from 'immutable'
import { Table, Button, OverlayTrigger, Popover, ListGroup, ListGroupItem } from 'react-bootstrap'
import { Round } from '../../common/immutable-round'
import { Game } from '../../common/immutable-game'
import { Player } from '../../common/immutable-player'

interface IPairringTableProps {
  readonly roundData: Round
  readonly playerList: Immutable.List<Player>
  readonly onPairingChanged: (roundData: Round) => void
}

interface IPairringTableState {
  readonly roundData: Round
}

export class PairringTable extends React.Component<IPairringTableProps, IPairringTableState> {
  constructor(props: IPairringTableProps) {
    super(props)

    this.state = { roundData: this.props.roundData }
  }

  public componentWillReceiveProps(nextProps: IPairringTableProps) {
    if (this.state.roundData === undefined || this.state.roundData.equals(nextProps.roundData) === false) {
      this.setState({ roundData: nextProps.roundData })
    }
  }

  /**
   * no need to do the following filterring, no very helpful because:
   * 1. this only filters a few players
   * 2. this cannot prevent a player to play a color 3 times in a row
   */
  /*
  private findPlayersCanPlaySide(side: string): Immutable.List<Player> {
    let players: Immutable.List<Player> = Immutable.List()
    this.props.roundData.games.forEach(game => {
      if (game) {
        if (game.redPlayer.number !== 0) {
          if (game.redPlayer.playedSides.size < 2) {
            players = players.push(game.redPlayer)
          } else {
            const last = game.redPlayer.playedSides.last()
            const lastLast = game.redPlayer.playedSides.get(game.redPlayer.playedSides.size - 2)
            if (last !== side || lastLast !== side) {
              players = players.push(game.redPlayer)
            }
          }
        } else {
          throw new Error('IMPOSSIBLE! a fake player takes red.')
        }
        if (game.blackPlayer.number !== 0) {
          if (game.blackPlayer.playedSides.size < 2) {
            players = players.push(game.blackPlayer)
          } else {
            const last = game.blackPlayer.playedSides.last()
            const lastLast = game.blackPlayer.playedSides.get(game.blackPlayer.playedSides.size - 2)
            if (last !== side || lastLast !== side) {
              players = players.push(game.blackPlayer)
            }
          }
        } else {
          // do nothing
        }
      }
    })

    return players
  }
  */

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
        <th>操作</th>
      </tr>
    )
  }

  private renderTableBody() {
    let ret: any[] = []
    this.state.roundData.games.forEach(game => {
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
          {this.renderName(row.redPlayer, row)}
          {this.renderResult(row)}
          {this.renderName(row.blackPlayer, row)}
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

  private renderName(player: Player, game: Game) {
    const situation = this.playerSituationInGame(player, game)
    const style = situation === 0 ? 'success' : 'playerinvalidingame'
    const placement = player === game.redPlayer ? 'left' : 'right'
    const title = `${player.name}：${player.score}分`
    let body = ''
    if (player.playedSides.size > 2) {
      body = '上2轮：'
      if (player.playedSides.get(-2) === 'red') {
        body += '红'
      } else {
        body += '黑'
      }
      body += player.playedResults.get(-2) + '，'
      if (player.playedSides.last() === 'red') {
        body += '红'
      } else {
        body += '黑'
      }
      body += player.playedResults.last()
    } else if (player.playedSides.size === 1) {
      body = '上1轮：'
      if (player.playedSides.last() === 'red') {
        body += '红'
      } else {
        body += '黑'
      }
      body += player.playedResults.last()
    } else {
    }

    let message = ''
    if (situation === 2) {
      const otherPlayer = player === game.redPlayer ? game.blackPlayer : game.redPlayer
      message = `已经和${otherPlayer.name}交过手了！`
    } else if (situation === 1) {
      message = `将连续3次执` + (player.playedSides.last() === 'red' ? '红' : '黑') + '！'
    }

    const playerMatchInfo = (
      <Popover id={'player' + player.number} title={title}>
        {body}
        <div className={style}>{message}</div>
      </Popover>
    )

    return (
      <OverlayTrigger trigger={['hover', 'focus']} placement={placement} overlay={playerMatchInfo}>
        <th className={style}>{player.name}</th>
      </OverlayTrigger>
    )
  }

  /**
   * check the situation of the player in this game
   * 0  OK
   * 1  is going to play red/black 3 times in a row
   * 2  has played with opponent
   * @param player
   * @param game
   */
  private playerSituationInGame(player: Player, game: Game): number {
    let sideToPlay, otherPlayer
    if (player === game.redPlayer) {
      sideToPlay = 'red'
      otherPlayer = game.blackPlayer
    } else if (player === game.blackPlayer) {
      sideToPlay = 'black'
      otherPlayer = game.redPlayer
    } else {
      throw new Error('UNEXPECTED! Try to generate style for a player not in the game.')
    }

    if (player.havePlayedWith(otherPlayer)) {
      return 2
    }

    if (player.playedSides.last() === sideToPlay) {
      const lastLastSide = player.playedSides.get(-2, 'outofboundary')
      if (lastLastSide == sideToPlay) {
        return 1
      }
    }

    return 0
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
    const actions = (
      <th>
        <OverlayTrigger
          trigger="focus"
          placement="left"
          overlay={this.buildPlayerListPopover(row.table, row.redPlayer, this.props.playerList)}
        >
          <Button bsSize="xsmall" bsStyle="warning">
            指定红方
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          trigger="focus"
          placement="left"
          overlay={this.buildPlayerListPopover(row.table, row.blackPlayer, this.props.playerList)}
        >
          <Button bsSize="xsmall" bsStyle="warning">
            指定黑方
          </Button>
        </OverlayTrigger>
      </th>
    )

    return actions
  }

  private buildPlayerListPopover(currentGameIndex: number, currentPlayer: Player, playerList: Immutable.List<Player>) {
    let ret = []
    for (let index = 0; index < playerList.size; index++) {
      const player = playerList.get(index)
      if (player === currentPlayer) {
        // don't add himself
        continue
      }
      ret.push(
        <ListGroupItem
          bsStyle="success"
          key={index}
          onClick={() => this.exchangePlayerInGame(currentGameIndex, currentPlayer, player)}
        >
          <strong>{player.name}：</strong> 分数：{player.score}
        </ListGroupItem>
      )
    }
    return (
      <Popover id="players-to-select" title="选择交换位置的选手" width="200" height="400">
        <ListGroup id="playerlist">{ret}</ListGroup>
      </Popover>
    )
  }

  private exchangePlayerInGame(table: number, currentPlayer: Player, withPlayer: Player) {
    if (currentPlayer === withPlayer) {
      // nothing to do if exchanging with himself
      throw new Error('IMPOSSIBLE!')
    }

    let roundData = this.state.roundData
    const gameIndex = table - 1
    let game: Game = roundData.games.get(gameIndex)

    const otherGameIndex = roundData.games.findIndex(
      (game: Game) => game.redPlayer === withPlayer || game.blackPlayer === withPlayer
    )
    if (otherGameIndex === -1) {
      throw new Error(`IMPOSSIBLE! Cannot find the player ${withPlayer.name}`)
    }

    let otherGame = roundData.games.get(otherGameIndex)

    let redPlayerForCurrentTable, blackPlayerForCurrentTable, redPlayerForOtherTable, blackPlayerForOtherTable

    if (otherGameIndex !== gameIndex) {
      // we are exchanging two players from different tables
      if (currentPlayer === game.redPlayer) {
        redPlayerForCurrentTable = withPlayer
        blackPlayerForCurrentTable = game.blackPlayer
      } else {
        redPlayerForCurrentTable = game.redPlayer
        blackPlayerForCurrentTable = withPlayer
      }
      if (withPlayer === otherGame.redPlayer) {
        redPlayerForOtherTable = currentPlayer
        blackPlayerForOtherTable = otherGame.blackPlayer
      } else {
        blackPlayerForOtherTable = currentPlayer
        redPlayerForOtherTable = otherGame.redPlayer
      }

      const newGame = new Game(game.table, redPlayerForCurrentTable, blackPlayerForCurrentTable)
      let games = roundData.games.set(gameIndex, newGame)
      roundData = roundData.set('games', games) as Round

      const newOtherGame = new Game(otherGame.table, redPlayerForOtherTable, blackPlayerForOtherTable)
      games = roundData.games.set(otherGameIndex, newOtherGame)
      roundData = roundData.set('games', games) as Round
    } else {
      // we are exchanging the two players in the same table
      if (currentPlayer === game.redPlayer) {
        redPlayerForCurrentTable = withPlayer
        blackPlayerForCurrentTable = currentPlayer
      } else {
        redPlayerForCurrentTable = currentPlayer
        blackPlayerForCurrentTable = withPlayer
      }
      const newGame = new Game(game.table, redPlayerForCurrentTable, blackPlayerForCurrentTable)
      let games = roundData.games.set(gameIndex, newGame)
      roundData = roundData.set('games', games) as Round
    }

    this.setState({ roundData: roundData })
    this.props.onPairingChanged(roundData)
  }
}
