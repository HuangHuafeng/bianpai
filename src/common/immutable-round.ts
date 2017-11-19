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

  public sortGames(): Round {
    // sort game by the score of the player with higher score
    // if equal, then by the score of the other player
    // if equal, then by the opponent score that the two playes have
    const sortComparator = (gameA: Game, gameB: Game): number => {
      const aMaxScore = Math.max(gameA.redPlayer.score, gameA.blackPlayer.score)
      const bMaxScore = Math.max(gameB.redPlayer.score, gameB.blackPlayer.score)
      if (aMaxScore !== bMaxScore) {
        // player with higher score should be in tables ahead
        return bMaxScore - aMaxScore
      }

      const aTotalScore = gameA.redPlayer.score + gameA.blackPlayer.score
      const bTotalScore = gameB.redPlayer.score + gameB.blackPlayer.score
      if (aTotalScore !== bTotalScore) {
        // then, the higher score the two players in a game have, the game should move ahead
        // this actually same as comparing the score of the other player
        return bTotalScore - aTotalScore
      }

      const aTotalOpponentScore = gameA.redPlayer.opponentScore + gameA.blackPlayer.opponentScore
      const bTotalOpponentScore = gameB.redPlayer.opponentScore + gameB.blackPlayer.opponentScore
      return bTotalOpponentScore - aTotalOpponentScore
    }

    let games = this.games.sort(sortComparator) as Immutable.List<Game>
    for (let index = 0; index < games.size; index++) {
      let game = games.get(index) as Game
      game = game.updateTable(index + 1)
      games = games.set(index, game)
    }

    return this.set('games', games) as this
  }
}
