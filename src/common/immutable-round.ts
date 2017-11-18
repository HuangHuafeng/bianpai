import * as Immutable from 'immutable'
import { Game } from './immutable-game'

let RoundRecord = Immutable.Record({
  number: 0,
  games: Immutable.List(),
})

export class Round extends RoundRecord {
  number: number
  games: Immutable.List<Game>

  constructor(number: number) {
    super({ number })
  }

  public addGame(game: Game): this {
    const index = this.games.findIndex(v => {
      return v
        ? v.table === game.table ||
            v.redPlayer === game.redPlayer ||
            v.redPlayer === game.blackPlayer ||
            v.blackPlayer === game.redPlayer ||
            v.blackPlayer === game.blackPlayer
        : false
    })
    if (index !== -1) {
      throw new Error(`UNEXPECTED! try to add a game that may already exist in the round`)
    }

    const games = this.games.push(game)
    return this.set('games', games) as this
  }

  public deletLastGame(): this {
    if (this.games.size === 0) {
      throw new Error(`UNEXPECTED! try to delete the last game from a round that does not have any game`)
    }

    const games = this.games.pop()
    return this.set('games', games) as this
  }

  public updateGameResult(table: number, result: string): this {
    const index = this.games.findIndex(v => (v ? v.table === table : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! try to add a game that does not exit in the round`)
    }

    const gameToReplace = this.games.get(index)
    const newgame = new Game(table, gameToReplace.redPlayer, gameToReplace.blackPlayer, result)
    const games = this.games.set(index, newgame)
    return this.set('games', games) as this
  }

  public canEnd(): boolean {
    return this.games.findIndex(v => (v ? v.result !== '+' && v.result !== '=' && v.result !== '-' : false)) === -1
  }
}
