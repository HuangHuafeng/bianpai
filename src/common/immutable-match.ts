import * as Immutable from 'immutable'
import * as assert from 'assert'
import { Player } from './immutable-player'
import { Game } from './immutable-game'
import { Round } from './immutable-round'

export enum MatchStatus {
  NotStarted,
  OnGoingPairing,
  OnGoingFighting,
  Finished,
}

export enum RoundStatus {
  NotStarted,
  OnGoingPairing,
  OnGoingFighting,
  Finished,
}

export const MAXIMUM_TOTAL_ROUNDS = 20

/**
  * currentRound:
  *    0: match has not started
  *    =totalRounds: match is in last round
  *    >totalRounds: match has finished
  */

let MatchBase = Immutable.Record({
  winScore: 2,
  loseScore: 0,
  drawScore: 1,
  name: '',
  organizer: '',
  totalRounds: 1,
  currentRound: 0,
  status: MatchStatus.NotStarted,
  players: Immutable.List(),
  matchData: Immutable.List(),
})

export class ImmutableMatch extends MatchBase {
  winScore: number
  loseScore: number
  drawScore: number
  name: string
  organizer: string
  totalRounds: number
  currentRound: number
  status: MatchStatus
  players: Immutable.List<Player>
  matchData: Immutable.List<Round>

  constructor() {
    super()
  }

  /**
   * generate a uniqe number for a new player.
   */
  private generatePlayerNumber(): number {
    // step 1: generate an array that contains preferred numbers
    let preferred = []
    for (let index = 0; index <= this.players.size; index++) {
      preferred.push(index + 1)
    }
    // step 2: remove the numbers that are already used by existing players
    for (let index = 0; index < this.players.size; index++) {
      const toBeRemoved = preferred.indexOf(this.players.get(index).number)
      if (toBeRemoved !== -1) {
        preferred.splice(toBeRemoved, 1)
      }
    }
    // step 3: return the smallest number of remaining preferred numbers
    return preferred[0]
  }

  /**
   * getters that don't mutate this objet
   */

  /**
   * return ** a copy ** of the player with number "number"
   * @param number number of the player
   */
  public getPlayerByNumber(number: number): Player | undefined {
    return this.players.find(player => (player ? player.number === number : false))
  }

  /**
   * return ** a copy ** of the player with name "name"
   * @param name name of the player
   */
  public getPlayerByName(name: string): Player | undefined {
    return this.players.find(player => (player ? player.name === name : false))
  }

  public getRoundStatus(round: number): RoundStatus {
    if (round <= 0 || round > this.totalRounds) {
      throw new Error('UNEXPECTED! try to get the status of an invalid round')
    }

    if (this.status === MatchStatus.NotStarted) {
      return RoundStatus.NotStarted
    }

    if (this.status === MatchStatus.Finished) {
      return RoundStatus.Finished
    }

    if (round < this.currentRound) {
      return RoundStatus.Finished
    }

    if (round > this.currentRound) {
      return RoundStatus.NotStarted
    }

    if (this.status === MatchStatus.OnGoingPairing) {
      return RoundStatus.OnGoingPairing
    }

    assert.ok(this.status === MatchStatus.OnGoingFighting, 'IMPOSSIBLE!')
    return RoundStatus.OnGoingFighting
  }

  public getRoundData(round: number): Round {
    if (round <= 0 || round > this.totalRounds) {
      throw new Error('UNEXPECTED!')
    }

    return this.matchData.get(round - 1)
  }

  /**
   * setters that creates and return a new ImmutableMatch object
   */

  public setName(name: string): this {
    if (name.length === 0) {
      throw new Error('name is empty!')
    }

    return this.set('name', name) as this
  }

  public setOrganizer(organizer: string): this {
    return this.set('organizer', organizer) as this
  }

  public setTotalRounds(totalRounds: number): this {
    if (totalRounds < 1) {
      throw new Error('totalRounds is less than 1!')
    }

    return this.set('totalRounds', totalRounds) as this
  }

  public addPlayer(name: string, organization: string = ''): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    const newPlayer = new Player(this.generatePlayerNumber(), name, organization)

    let players = this.players.push(newPlayer)
    const tempMatch = this.set('players', players) as this
    return tempMatch.playersUpdated()
  }

  /**
     * update a player.
     * @param number
     * @param player
     */
  public updatePlayer(number: number, player: Player): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    const index = this.players.findIndex(v => (v ? v.number === number : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${number}"`)
    }

    const players = this.players.set(index, player)
    const tempMatch = this.set('players', players) as this
    return tempMatch.playersUpdated()
  }

  /**
     * remove the player with number "number"
     * @param number
     */
  public removePlayer(number: number): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    const index = this.players.findIndex(v => (v ? v.number === number : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${number}"`)
    }

    let players = this.players.remove(index)
    const tempMatch = this.set('players', players) as this
    return tempMatch.playersUpdated()
  }

  private playersUpdated(): this {
    // it's not allowed to add/remove/modify player when the players are fighting
    assert.ok(this.disallowUpdatePlayers() === false, 'IMPOSSIBLE!')

    // if match is not started or already finished, nothing to do
    if (this.status === MatchStatus.NotStarted || this.status === MatchStatus.Finished) {
      return this
    }

    assert.ok(this.status === MatchStatus.OnGoingPairing, 'IMPOSSIBLE!')
    // re-pairing the opponents
    return this.updateOpponentsPairting()
  }

  private updateOpponentsPairting(): this {
    const roundData = this.pairOpponents(this.currentRound, this.players)
    const matchData = this.matchData.set(this.currentRound - 1, roundData)
    return this.set('matchData', matchData) as this
  }

  public disallowUpdatePlayers(): boolean {
    if (this.status === MatchStatus.Finished || this.status === MatchStatus.OnGoingFighting) {
      return true
    }

    return false
  }

  /**
   * remove all players
   */
  public removeAllPlayers(): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    const tempMatch = this.set('players', Immutable.List()) as this
    return tempMatch.playersUpdated()
  }

  public updateTableResult(round: number, table: number, result: string): this {
    if (round !== this.currentRound || this.status !== MatchStatus.OnGoingFighting) {
      throw new Error('UNEXPECTED! trying to update result of a table in a wrong time!')
    }

    const roundData: Round = this.getRoundData(round).updateGameResult(table, result)
    const matchData = this.matchData.set(round - 1, roundData)
    return this.set('matchData', matchData) as this
  }

  public startCurrentRound(currentRound: number): this {
    if (currentRound !== this.currentRound) {
      throw new Error('UNEXPECTED! trying to start a noncurrent round!')
    }

    return this.set('status', MatchStatus.OnGoingFighting) as this
  }

  public start(): this {
    if (this.status !== MatchStatus.NotStarted || this.currentRound !== 0) {
      console.log('status: ' + this.status)
      console.log('currentRound: ' + this.currentRound)
      throw new Error('UNEXPECTED! match is already started!')
    }
    assert.ok(this.totalRounds > this.currentRound, 'IMPOSSIBLE! match is already started!')

    return this.gotoNextRound()
  }

  private gotoNextRound(): this {
    if (this.currentRound == this.totalRounds) {
      // already the last round, then mark the match as finished
      return this.set('status', MatchStatus.Finished) as this
    } else {
      let tempMatch = this.set('currentRound', this.currentRound + 1) as this
      tempMatch = tempMatch.set('status', MatchStatus.OnGoingPairing) as this
      return tempMatch.updateOpponentsPairting()
    }
  }

  /**
   * this function SHOULD NOT mutate anything.
   */
  private pairOpponents(roundNumber: number, players: Immutable.List<Player>): Round {
    assert.ok(
      this.status === MatchStatus.OnGoingPairing && this.currentRound > 0 && this.currentRound <= this.totalRounds,
      'IMPOSSIBLE! something wrong when pairing!'
    )

    return this.pairOpponentsWithMonradSystem(roundNumber, players)
  }

  /**
   * https://en.wikipedia.org/wiki/Swiss-system_tournament
   */
  private pairOpponentsWithMonradSystem(roundNumber: number, players: Immutable.List<Player>): Round {
    // sort players by score, if scores are equal, then by number
    let sortComparator = (playerA: Player, playerB: Player): number => {
      return (playerB.score - playerA.score) * 1000 + (playerA.number - playerB.number) * 1
    }
    let playersToPair = players.sort(sortComparator) as Immutable.List<Player>
    let roundData: Round = new Round(roundNumber)

    while (playersToPair.size > 0) {
      const playerA = playersToPair.first()
      playersToPair = playersToPair.shift()

      let playerB = undefined
      if (playersToPair.size > 0) {
        /*
        // we then go through the list reversely to find a opponent, :)
        // then we select the opponent whose number has biggest difference
        const smallestGap = playersToPair.size / 2
        const scoreToFind = playersToPair.first().score
        let numberOfCandidates = playersToPair.findLastIndex(v => (v ? v.score === scoreToFind : false))
        let start = 0
        if (numberOfCandidates > smallestGap) {
          start = Math.round(smallestGap - 0.5)
        }
        let index = start
        while (index < playersToPair.size) {
          if (
            playersToPair.get(index).playedOpponents.findIndex(v => (v ? v.number === playerA.number : false)) === -1
          ) {
            playerB = playersToPair.get(index)
            playersToPair = playersToPair.delete(index)
            break
          }
          index++
        }
        */
        let index = 0
        while (index < playersToPair.size) {
          if (
            playersToPair.get(index).playedOpponents.findIndex(v => (v ? v.number === playerA.number : false)) === -1
          ) {
            playerB = playersToPair.get(index)
            playersToPair = playersToPair.delete(index)
            break
          }
          index++
        }
      } else {
        playerB = new Player(0, '')
        const game = new Game(roundData.games.size + 1, playerA, playerB)
        roundData = roundData.addGame(game)
        continue
      }

      if (!playerB) {
        // this happens, probably this should be solved by the user to adjust it manually.
        console.log(`${playerA.name}已经和所有剩下的选手下过棋了！`)
        // just select the first one
        playerB = playersToPair.first()
        playersToPair = playersToPair.shift()
      }

      const table = roundData.games.size + 1
      let game
      if (this.decideSides(playerA, playerB) === -1) {
        game = new Game(table, playerA, playerB)
      } else {
        game = new Game(table, playerB, playerA)
      }

      roundData = roundData.addGame(game)
    }

    return roundData
  }

  /**
   * -1 if playerA should play red
   * 1 if playerA should play black
   * 0 doesn't matter
   */
  private decideSides(playerA: Player, playerB: Player): number {
    let ret = 0

    if (playerB.playedSides.size !== 0) {
      const playerALast = playerA.playedSides.last()
      const playerBLast = playerB.playedSides.last()
      if (playerALast === playerBLast) {
        if (playerA.playedSides.size > 1) {
          const playerALastLast = playerA.playedSides.get(playerA.size - 2)
          const playerBLastLast = playerB.playedSides.get(playerA.size - 2)
          if (playerALastLast === playerBLastLast) {
            ret = 0 // doesn't matter
            // we don't check if last===lastlast, because even if it happens, we can't do anything
          } else {
            if (playerALast === playerALastLast) {
              if (playerALast === 'red') {
                ret = 1 // player A should play black, so he won't play red 3 times in a row
              } else {
                ret = -1 // player A should play red, so he won't play black 3 times in a row
              }
            } else {
              // playerBLast === playerBLastLast
              if (playerBLast === 'red') {
                ret = -1 // player A should play red, so playerB won't play red 3 times in a row
              } else {
                ret = 1 // player A should play black, so playerB won't play black 3 times in a row
              }
            }
          }
        } else {
          ret = 0 // doesn't matter
        }
      } else {
        if (playerALast === 'red') {
          ret = 1 // player A should play black
        } else {
          ret = -1 // player A should play red
        }
      }
    } else {
      ret = -1 // doesn't matter, but in case playerB is a fake player, we want the fake player to play black
    }

    return ret
  }

  /**
   * the simplest pairing: 1&2, 3&4, ...
   */
  private pairOpponentsV1(roundNumber: number, players: Immutable.List<Player>): Round {
    let playersToPair = players
    if (playersToPair.size % 2) {
      playersToPair = players.push(new Player(0, ''))
    }
    let roundData: Round = new Round(roundNumber)
    for (let index = 0; index < playersToPair.size; index += 2) {
      const game = new Game((index + 2) / 2, playersToPair.get(index), playersToPair.get(index + 1))
      roundData = roundData.addGame(game)
    }

    return roundData
  }

  /**
 * pairs the players who has close score
 */
  private pairOpponentsV2(roundNumber: number, players: Immutable.List<Player>): Round {
    const playersToPair = players.sort((playerA, playerB) => playerB.score - playerA.score) as Immutable.List<Player>
    return this.pairOpponentsV1(roundNumber, playersToPair)
  }

  public endCurrentRound(currentRound: number): this {
    if (
      currentRound <= 0 ||
      currentRound > this.totalRounds ||
      currentRound !== this.currentRound ||
      this.status !== MatchStatus.OnGoingFighting
    ) {
      throw new Error('UNEXPECTED!')
    }

    let roundData = this.getRoundData(this.currentRound)
    if (!roundData.canEnd()) {
      // there's still game not finished, so we do nothing
      return this
    }

    // then update the scores, sides of the players according to the round result
    let tempPlayers = this.updatePlayersAccordingToRoundResult(roundData)
    const tempMatch = this.set('players', tempPlayers) as this

    // go to next round
    return tempMatch.gotoNextRound()
  }

  /**
   * updatePlayersAccordingToRoundResult() does the following:
   * 1. update the score of the players
   * 2. update the "played opponents" of the players
   * 3. update the "played side" (black, red) of the players
   */
  /**
   * CAUSION: updatePlayersAccordingToRoundResult() uses the information previously written, so any update
   * to players before updatePlayersAccordingToRoundResult() will be overwritten by updatePlayersAccordingToRoundResult()!!!
   */
  private updatePlayersAccordingToRoundResult(roundData: Round): Immutable.List<Player> {
    let tempPlayers = this.players
    roundData.games.forEach(game => {
      if (game) {
        let redDiff, blackDiff
        switch (game.result) {
          case '+':
            redDiff = this.winScore
            blackDiff = this.loseScore
            break

          case '-':
            redDiff = this.loseScore
            blackDiff = this.winScore
            break

          case '=':
            redDiff = this.drawScore
            blackDiff = this.drawScore
            break

          default:
            throw new Error('IMPOSSIBLE! game is not finished!')
        }

        // update the red player if not a fake player
        if (game.redPlayer.number !== 0) {
          let updatedRedPlayer = game.redPlayer.setScore(game.redPlayer.score + redDiff)
          updatedRedPlayer = updatedRedPlayer.addPlayedOpponent(game.blackPlayer)
          updatedRedPlayer = updatedRedPlayer.addPlayedSides('red')
          const redPlayerIndex = tempPlayers.findIndex(v => (v ? v.number === updatedRedPlayer.number : false))
          if (redPlayerIndex === -1) {
            throw new Error(`IMPOSSIBLE! failed to find the player with number "${updatedRedPlayer.number}"`)
          }
          tempPlayers = tempPlayers.set(redPlayerIndex, updatedRedPlayer)
        }

        // update the black player if not a fake player
        if (game.blackPlayer.number !== 0) {
          let updatedBlackPlayer = game.blackPlayer.setScore(game.blackPlayer.score + blackDiff)
          updatedBlackPlayer = updatedBlackPlayer.addPlayedOpponent(game.redPlayer)
          updatedBlackPlayer = updatedBlackPlayer.addPlayedSides('black')
          const blackPlayerIndex = tempPlayers.findIndex(v => (v ? v.number === updatedBlackPlayer.number : false))
          if (blackPlayerIndex === -1) {
            throw new Error(`IMPOSSIBLE! failed to find the player with number "${updatedBlackPlayer.number}"`)
          }
          tempPlayers = tempPlayers.set(blackPlayerIndex, updatedBlackPlayer)
        }
      } else {
        throw new Error('IMPOSSIBLE! game is undefined!')
      }
    })

    return tempPlayers
  }
}
