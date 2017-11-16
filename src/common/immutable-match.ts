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
    const newPlayer = new Player(this.generatePlayerNumber(), name, organization)

    let players = this.players.push(newPlayer)
    return this.set('players', players) as this
  }

  /**
     * update a player.
     * @param number
     * @param player
     */
  public updatePlayer(number: number, player: Player): this {
    const index = this.players.findIndex(v => (v ? v.number === number : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${number}"`)
    }

    const players = this.players.set(index, player)
    return this.set('players', players) as this
  }

  /**
     * remove the player with number "number"
     * @param number
     */
  public removePlayer(number: number): this {
    const index = this.players.findIndex(v => (v ? v.number === number : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${number}"`)
    }

    let players = this.players.remove(index)
    return this.set('players', players) as this
  }

  /**
   * remove all players
   */
  public removeAllPlayers(): this {
    return this.set('players', Immutable.List()) as this
  }

  public updateTableResult(round: number, table: number, result: string): this {
    if (round !== this.currentRound || this.status !== MatchStatus.OnGoingFighting) {
      throw new Error('UNEXPECTED! trying to update result of a table in a wrong time!')
    }

    const roundData: Round = this.matchData.get(round - 1).updateGameResult(table, result)
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
      let tempMatch = this.set('status', MatchStatus.OnGoingPairing) as this
      tempMatch = tempMatch.set('currentRound', tempMatch.currentRound + 1) as this

      // the data of round n is stored in this.matchData[n - 1]
      return tempMatch.pairOpponents()
    }
  }

  private pairOpponents(): this {
    return this.pairOpponentsV1()
  }

  /**
   * the simplest pairing: 1&2, 3&4, ...
   */
  private pairOpponentsV1(): this {
    assert.ok(
      this.status === MatchStatus.OnGoingPairing && this.currentRound > 0 && this.currentRound <= this.totalRounds,
      'IMPOSSIBLE! something wrong when pairing!'
    )
    let players = this.players
    if (this.players.size % 2) {
      const fakePlayer = new Player(0, '轮空')
      players = players.push(fakePlayer)
    }
    let currentRoundData: Round = new Round(this.currentRound)
    for (let index = 0; index < players.size; index += 2) {
      const game = new Game((index + 2) / 2, players.get(index).number, players.get(index + 1).number)
      currentRoundData = currentRoundData.addGame(game)
    }
    let matchData = this.matchData.set(this.currentRound - 1, currentRoundData)
    return this.set('matchData', matchData) as this
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

    let roundData = this.matchData.get(currentRound - 1)
    if (!roundData.canEnd()) {
      // there's still game not finished, so we do nothing
      return this
    }

    // then update the scores, sides of the players according to the round result
    this.updateRoundData()

    // go to next round
    return this.gotoNextRound()
  }

  private updateRoundData() {
    // to update later
  }
}
