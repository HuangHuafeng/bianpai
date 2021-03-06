import * as Immutable from 'immutable'
import * as assert from 'assert'
import { Player } from './immutable-player'
import { Game } from './immutable-game'
import { Round } from './immutable-round'
import { debugLog } from './helper-functions'

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
  totalRounds: 7,
  currentRound: 0,
  status: MatchStatus.NotStarted,
  playerList: Immutable.List(),
  matchData: Immutable.List(),
  judge: '',
  arranger: '',
  note: '',
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
  playerList: Immutable.List<Player>
  matchData: Immutable.List<Round>
  judge: string
  arranger: string
  note: string

  constructor() {
    super()
  }

  /**
   * generate a uniqe number for a new player.
   */
  private generatePlayerNumber(): number {
    // step 1: generate an array that contains preferred numbers
    let preferred = []
    for (let index = 0; index <= this.playerList.size; index++) {
      preferred.push(index + 1)
    }
    // step 2: remove the numbers that are already used by existing players
    for (let index = 0; index < this.playerList.size; index++) {
      const toBeRemoved = preferred.indexOf(this.playerList.get(index).number)
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
    return this.getPlayerInPlayerListByNumber(number, this.playerList)
  }

  private getPlayerInPlayerListByNumber(number: number, playerList: Immutable.List<Player>): Player | undefined {
    return playerList.find(player => (player ? player.number === number : false))
  }

  /**
   * return ** a copy ** of the player with name "name"
   * @param name name of the player
   */
  public getPlayerByName(name: string): Player | undefined {
    return this.playerList.find(player => (player ? player.name === name : false))
  }

  public getQualifiedNumber(): number {
    return this.generatePlayerNumber()
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

  public addPlayer(name: string, organization: string = '', note: string = '', preferredNumber?: number): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    let number
    if (preferredNumber && preferredNumber !== 0 && this.getPlayerByNumber(preferredNumber) === undefined) {
      number = preferredNumber
    } else {
      number = this.generatePlayerNumber()
    }
    const newPlayer = new Player(number, name, organization, note)

    let playerList = this.playerList.push(newPlayer)
    const tempMatch = this.set('playerList', playerList) as this
    return tempMatch.playersUpdated()
  }

  /**
     * update a player.
     * @param number
     * @param player
     */
  /*
  public updatePlayer(number: number, player: Player): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    const index = this.playerList.findIndex(v => (v ? v.number === number : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${number}"`)
    }

    const playerList = this.playerList.set(index, player)
    const tempMatch = this.set('playerList', playerList) as this
    return tempMatch.playersUpdated()
  }
  */
  public updatePlayer(
    currentNumber: number,
    newNumber: number,
    name: string,
    organization: string = '',
    note: string = ''
  ): this {
    if (this.disallowUpdatePlayers()) {
      return this
    }

    let player = this.getPlayerByNumber(currentNumber)
    if (player === undefined) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${currentNumber}"`)
    }
    player = player.setNumber(newNumber)
    player = player.setName(name)
    player = player.setOrganization(organization)
    player = player.setNote(note)

    const index = this.playerList.findIndex(v => (v ? v.number === currentNumber : false))
    const playerList = this.playerList.set(index, player)
    const tempMatch = this.set('playerList', playerList) as this
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

    const index = this.playerList.findIndex(v => (v ? v.number === number : false))
    if (index === -1) {
      throw new Error(`UNEXPECTED! failed to find the player with number "${number}"`)
    }

    const updatedPlayerList = this.playerList.remove(index)
    const tempMatch = this.set('playerList', updatedPlayerList) as this
    return tempMatch.playersUpdated()
  }

  private playersUpdated(): this {
    // it's not allowed to add/remove/modify player when the players are fighting
    assert.ok(this.disallowUpdatePlayers() === false, 'IMPOSSIBLE!')

    // sort the players
    const updatedPlayerList = this.sortPlayers(this.playerList)
    const tempMatch = this.set('playerList', updatedPlayerList) as this

    // if match is not started or already finished, nothing to do
    if (this.status === MatchStatus.NotStarted || this.status === MatchStatus.Finished) {
      return tempMatch
    }

    assert.ok(this.status === MatchStatus.OnGoingPairing, 'IMPOSSIBLE!')
    // re-pairing the opponents
    return tempMatch.updateOpponentsPairting()
  }

  private updateOpponentsPairting(): this {
    const roundData = this.pairOpponents(this.currentRound, this.playerList)
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

    const tempMatch = this.set('playerList', Immutable.List()) as this
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

  public setCurrentRoundPairring(roundData: Round): this {
    if (this.status !== MatchStatus.OnGoingPairing) {
      throw new Error('UNEXPECTED! change pairing data at wrong time!')
    }

    const matchData = this.matchData.set(this.currentRound - 1, roundData)
    return this.set('matchData', matchData) as this
  }

  public start(): this {
    if (this.status !== MatchStatus.NotStarted || this.currentRound !== 0) {
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
  private pairOpponents(roundNumber: number, playerList: Immutable.List<Player>): Round {
    assert.ok(
      this.status === MatchStatus.OnGoingPairing && this.currentRound > 0 && this.currentRound <= this.totalRounds,
      'IMPOSSIBLE! something wrong when pairing!'
    )

    let playersToPair = playerList
    if (playersToPair.size % 2) {
      playersToPair = playersToPair.push(new Player(0, ''))
    }

    return this.pairOpponentsWithMonradSystem(roundNumber, playersToPair)
  }

  public sortPlayers(playerList: Immutable.List<Player>): Immutable.List<Player> {
    // sort players by score, if scores are equal, then by number
    const sortComparator = (playerA: Player, playerB: Player): number => {
      let value =
        (playerB.score - playerA.score) * 100000 +
        (playerB.opponentScore - playerA.opponentScore) * 100 +
        (playerA.number - playerB.number) * 1

      const fakePlayerValue = value ? Math.abs(value) * 100 : 10000
      if (playerA.number === 0) {
        value += fakePlayerValue
      }
      if (playerB.number === 0) {
        value -= fakePlayerValue
      }

      return value
    }

    return playerList.sort(sortComparator) as Immutable.List<Player>
  }

  /**
   * we would like to have a predictable pairing for the first round for 2n players
   * 1 vs n+1, 2 vs n+2, ..., n vs 2n
   * the players should already be sorted!!!
   * the list must have even number of players!!!
   */
  private pairFirstRound(playerList: Immutable.List<Player>): Round {
    if (playerList.size % 2) {
      throw new Error('UNEXPECTED! The list have odd number of players.')
    }

    let roundData: Round = new Round(1)
    const interval = playerList.size / 2

    for (let index = 0; index < interval; index++) {
      const table = roundData.games.size + 1
      const redPlayer = playerList.get(index)
      let blackPlayer = playerList.get(index + interval)
      if (!blackPlayer) {
        blackPlayer = new Player(0, '')
      }
      const game = new Game(table, redPlayer, blackPlayer)
      roundData = roundData.addGame(game)
    }

    return roundData
  }

  private pairWithSimpleWay(roundNumber: number, playerList: Immutable.List<Player>): Round {
    let roundData: Round = new Round(roundNumber)
    let playersToPair = playerList

    while (playersToPair.size > 0) {
      const playerA = playersToPair.first()
      playersToPair = playersToPair.shift()

      let playerB = undefined
      if (playersToPair.size > 0) {
        playerB = playersToPair.first()
        playersToPair = playersToPair.shift()
      } else {
        playerB = new Player(0, '')
      }

      const side = this.decideSidesV2(playerA, playerB)
      const table = roundData.games.size + 1
      let game
      if (side === -1) {
        game = new Game(table, playerA, playerB)
      } else {
        game = new Game(table, playerB, playerA)
      }
      roundData = roundData.addGame(game)
    }

    return roundData
  }

  /**
   * selects THE FIRST player that meets the criteria as opponent for "player"
   * returns the index of selected player, -1 if failed to find an opponent
   * @param player who need an opponent
   * @param candiates candidate opponent for the player
   */
  private selectOpponent(player: Player, candiates: Immutable.List<Player>): number {
    if (player.number === 0) {
      throw new Error('UNEXPECTED! Try to select an opponent for a fake player!')
    }

    if (candiates.size === 0) {
      throw new Error('UNEXPECTED! Candidate list is empty!')
    }

    const roundsPlayed = player.playedOpponents.size
    let opponentIndex = -1
    if (roundsPlayed === 0) {
      // we should select the first player in the candidate list
      opponentIndex = 0
    } else if (roundsPlayed === 1) {
      const oppoentCriteriaForTheSecondRound = (candidatePlayer: Player): boolean => {
        if (player.hasPlayedWith(candidatePlayer)) {
          // if player have played with candidatePlayer, we should not select it
          return false
        }

        return true
      }

      opponentIndex = candiates.findIndex(oppoentCriteriaForTheSecondRound)
    } else {
      const opponentCriteriaAfterTwoRounds = (candidatePlayer: Player): boolean => {
        if (player.hasPlayedWith(candidatePlayer)) {
          // if player have played with candidatePlayer, we should not select it
          return false
        }

        const playerLastSide = player.playedSides.last()
        const playerLastLastSide = player.playedSides.get(player.playedSides.size - 2)
        if (playerLastSide === playerLastLastSide) {
          // we need to check if candidatePlayer is a fake player
          if (candidatePlayer.number === 0) {
            return false
          }

          // we then check what sides candidatePlayer played in the last two rounds
          const candidatePlayerLastSide = candidatePlayer.playedSides.last()
          const candidatePlayerLastLastSide = candidatePlayer.playedSides.get(candidatePlayer.playedSides.size - 2)
          if (candidatePlayerLastSide === candidatePlayerLastLastSide) {
            if (playerLastSide === candidatePlayerLastSide) {
              // in this case, candidatePlayer should NOT be selected as opponent
              // since if selected, one of player and candidatePlayer have to play red/black 3 times in a row!!!
              return false
            }
          }
        }

        return true
      }

      opponentIndex = candiates.findIndex(opponentCriteriaAfterTwoRounds)
    }

    return opponentIndex
  }

  /**
   * the players should already be sorted!!!
   * the algorithm is not perfect, so it probably can NOT pair the player so that the
   * players of each game have NOT played before. thus, we will pairFirstRound() if
   * the roundNumber is bigger then half of players.size.
   */
  private pairNotFistRoundMonradSystem(roundNumber: number, playerList: Immutable.List<Player>): Round {
    if (playerList.size % 2) {
      throw new Error('UNEXPECTED! The list have odd number of players.')
    }

    let roundData: Round = new Round(roundNumber)
    let playersToPair = playerList
    let gamesToRecreate = 1
    const retryMaximum = playerList.size
    while (playersToPair.size > 0) {
      const playerA = playersToPair.first()
      playersToPair = playersToPair.shift()

      let playerB: Player | undefined = undefined
      if (playersToPair.size > 0) {
        const opponentIndex = this.selectOpponent(playerA, playersToPair)
        if (opponentIndex !== -1) {
          // we found an opponent
          playerB = playersToPair.get(opponentIndex)
          playersToPair = playersToPair.delete(opponentIndex)

          const side = this.decideSidesV2(playerA, playerB)
          const table = roundData.games.size + 1
          let game
          switch (side) {
            case -1:
              game = new Game(table, playerA, playerB)
              break

            case 1:
              game = new Game(table, playerB, playerA)
              break

            case 0:
            default:
              throw new Error('IMPOSSIBLE! We have already avoided this to happen.')
          }

          roundData = roundData.addGame(game)
          continue
        } else {
          // we failed to an opponent for playerA
          debugLog(`Cannot find an opponent for ${playerA.name}!`)
          debugLog(`gamesToRecreate is ${gamesToRecreate}！`)
          // we have tried our best, make sure that we won't stuck in this process
          if (gamesToRecreate > retryMaximum) {
            debugLog('找不到选手和没有对战过的选手配对的对阵表！')
            return this.pairWithSimpleWay(roundNumber, playerList)
          }

          // failed to find a player that have NOT played with playerA
          // in this case, we delete gamesToRecreate games from roundData
          // and put the players back to playersToPair with a little different
          // order, then pair again
          for (let index = 0; index < gamesToRecreate && roundData.games.size > 0; index++) {
            const lastGame = roundData.games.last()
            roundData = roundData.deletLastGame()
            assert.ok(lastGame.redPlayer.number !== 0, 'IMPOSSIBLE! A fake player never has chance to play red!')
            playersToPair = playersToPair.unshift(...[lastGame.redPlayer])
            if (lastGame.blackPlayer.number !== 0) {
              playersToPair = playersToPair.unshift(...[lastGame.blackPlayer])
            } else {
              // if blackPlayer is a fake player, add it to the end of the list
              playersToPair = playersToPair.push(lastGame.blackPlayer)
            }
          }
          playersToPair = playersToPair.unshift(...[playerA])
          gamesToRecreate++
        }
      } else {
        throw new Error('IMPOSSIBLE! We should not reach here.')
      }
    }

    // we should sort the games so players with high scores are in the begining tables
    roundData = roundData.sortGames()
    return roundData
  }

  /**
   * https://en.wikipedia.org/wiki/Swiss-system_tournament
   */
  private pairOpponentsWithMonradSystem(roundNumber: number, playerList: Immutable.List<Player>): Round {
    let playersToPair = this.sortPlayers(playerList)
    if (roundNumber === 1) {
      return this.pairFirstRound(playersToPair)
    }

    return this.pairNotFistRoundMonradSystem(roundNumber, playersToPair)
  }

  /**
   * it is preferred to let playerA plays red
   * -1 if playerA should play red
   * 1 if playerA should play black
   * 0 one of the player is going to play red/black 3 time in a row
   */

  private decideSidesV2(playerA: Player, playerB: Player): number {
    let ret = -1 // it is preferred to let playerA plays red

    assert.ok(playerA.number !== 0, 'IMPOSSIBLE!')
    if (playerB.number === 0) {
      return -1
    }

    /**
     * -1 playerA plays red
     * 1 playerA plays black
     * 0 cannot decide
     * 10 red or black is both OK for playerA and playerB, thus need more checks to balance
     */
    const sidesMap = [
      [
        [
          [0, 1], //playerA: red, red, playerB: red, ?
          [1, 1], //playerA: red, red, playerB: black, ?
        ],
        [
          [-1, 10], //playerA: red, black, playerB: red, ?
          [10, 1], //playerA: red, black, playerB: black, ?
        ],
      ],
      [
        [
          [-1, 10], //playerA: black, red, playerB: red, ?
          [10, 1], //playerA: black, red, playerB: black, ?
        ],
        [
          [-1, -1], //playerA: black, black, playerB: red, ?
          [-1, 0], //playerA: black, black, playerB: black, ?
        ],
      ],
    ]

    if (playerA.playedSides.size > 1) {
      const playerALast = playerA.playedSides.last()
      const playerBLast = playerB.playedSides.last()
      const playerALastLast = playerA.playedSides.get(playerA.playedSides.size - 2)
      const playerBLastLast = playerB.playedSides.get(playerB.playedSides.size - 2)

      let aLastLastIndex, aLastIndex, bLastLastIndex, bLastIndex
      if (playerALastLast === 'red') {
        aLastLastIndex = 0
      } else {
        aLastLastIndex = 1
      }
      if (playerBLastLast === 'red') {
        bLastLastIndex = 0
      } else {
        bLastLastIndex = 1
      }
      if (playerALast === 'red') {
        aLastIndex = 0
      } else {
        aLastIndex = 1
      }
      if (playerBLast === 'red') {
        bLastIndex = 0
      } else {
        bLastIndex = 1
      }

      ret = sidesMap[aLastLastIndex][aLastIndex][bLastLastIndex][bLastIndex]
      if (ret === 10) {
        const aNumberOfRed = playerA.playedSides.count(side => side === 'red')
        const aNumberOfBlack = playerA.playedSides.count(side => side === 'black')
        const aPlayedFakePlayer = playerA.playedOpponents.count(opponent => (opponent ? opponent.number === 0 : false))
        const bNumberOfRed = playerB.playedSides.count(side => side === 'red')
        const bNumberOfBlack = playerB.playedSides.count(side => side === 'black')
        const bPlayedFakePlayer = playerB.playedOpponents.count(opponent => (opponent ? opponent.number === 0 : false))
        if (
          Math.abs(aNumberOfRed - aPlayedFakePlayer - aNumberOfBlack) >=
          Math.abs(bNumberOfRed - bPlayedFakePlayer - bNumberOfBlack)
        ) {
          if (aNumberOfRed < aNumberOfBlack) {
            ret = -1
          } else {
            ret = 1
          }
        } else {
          if (bNumberOfRed < bNumberOfBlack) {
            ret = 1
          } else {
            ret = -1
          }
        }
      }
    } else if (playerB.playedSides.size === 1) {
      // in this case, no need to check what playerB played in previous round
      const playerALast = playerA.playedSides.last()
      if (playerALast === 'red') {
        ret = 1
      } else {
        ret = -1
      }
    }

    return ret
  }

  /**
   * the simplest pairing: 1&2, 3&4, ...
   */
  /*
  private pairOpponentsV1(roundNumber: number, playerList: Immutable.List<Player>): Round {
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
  */

  /**
    * pairs the players who has close score
    */
  /*
  private pairOpponentsV2(roundNumber: number, playerList: Immutable.List<Player>): Round {
    const playersToPair = players.sort((playerA, playerB) => playerB.score - playerA.score) as Immutable.List<Player>
    return this.pairOpponentsV1(roundNumber, playersToPair)
  }
  */

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
    let tempPlayerList = this.updatePlayersAccordingToRoundResultV2(this.playerList, roundData)
    tempPlayerList = this.updateOpponentScoreOfPlayersV2(tempPlayerList)
    let tempMatch = this.set('playerList', tempPlayerList) as this

    // go to next round
    return tempMatch.gotoNextRound()
  }

  /**
   * player of each game should be in the list
   * @param playerList The list of players in the round
   * @param roundData The data of the round
   */
  private updatePlayersAccordingToRoundResultV2(
    playerList: Immutable.List<Player>,
    roundData: Round
  ): Immutable.List<Player> {
    let tempPlayerList = playerList
    roundData.games.forEach(game => {
      if (game) {
        let redDiff, blackDiff, redResult, blackResult
        switch (game.result) {
          case '+':
            redDiff = this.winScore
            blackDiff = this.loseScore
            redResult = '+'
            blackResult = '-'
            break

          case '-':
            redDiff = this.loseScore
            blackDiff = this.winScore
            redResult = '-'
            blackResult = '+'
            break

          case '=':
            redDiff = this.drawScore
            blackDiff = this.drawScore
            redResult = '='
            blackResult = '='
            break

          default:
            throw new Error('IMPOSSIBLE! game is not finished!')
        }

        // update the red player if not a fake player
        if (game.redPlayer.number !== 0) {
          // CAUSION: we should get the player from the match again
          // it's possible that the players have been updated!!!
          const redPlayerIndex = tempPlayerList.findIndex(v => (v ? v.number === game.redPlayer.number : false))
          if (redPlayerIndex === -1) {
            throw new Error(`UNEXPECTED! failed to find the player with number "${game.redPlayer.number}"`)
          }
          let updatedRedPlayer = tempPlayerList.get(redPlayerIndex)
          updatedRedPlayer = updatedRedPlayer.setScore(updatedRedPlayer.score + redDiff)
          updatedRedPlayer = updatedRedPlayer.addPlayedOpponent(game.blackPlayer)
          updatedRedPlayer = updatedRedPlayer.addPlayedSide('red')
          updatedRedPlayer = updatedRedPlayer.addPlayedResult(redResult)
          tempPlayerList = tempPlayerList.set(redPlayerIndex, updatedRedPlayer)
        }

        // update the black player if not a fake player
        if (game.blackPlayer.number !== 0) {
          // CAUSION: we should get the player from the match again
          // it's possible that the players have been updated!!!
          const blackPlayerIndex = tempPlayerList.findIndex(v => (v ? v.number === game.blackPlayer.number : false))
          if (blackPlayerIndex === -1) {
            throw new Error(`UNEXPECTED! failed to find the player with number "${game.blackPlayer.number}"`)
          }
          let updatedBlackPlayer = tempPlayerList.get(blackPlayerIndex)
          updatedBlackPlayer = updatedBlackPlayer.setScore(updatedBlackPlayer.score + blackDiff)
          updatedBlackPlayer = updatedBlackPlayer.addPlayedOpponent(game.redPlayer)
          updatedBlackPlayer = updatedBlackPlayer.addPlayedSide('black')
          updatedBlackPlayer = updatedBlackPlayer.addPlayedResult(blackResult)
          tempPlayerList = tempPlayerList.set(blackPlayerIndex, updatedBlackPlayer)
        }
      } else {
        throw new Error('IMPOSSIBLE! game is undefined!')
      }
    })

    return tempPlayerList
  }

  /**
   * updatePlayersAccordingToRoundResult() does the following:
   * 1. update the score of the players
   * 2. update the "played opponents" of the players
   * 3. update the "played side" (black, red) of the players
   * 4. update the opponentScore of the players
   */
  /**
   * CAUSION: updatePlayersAccordingToRoundResult() uses the information previously written, so any update
   * to players before updatePlayersAccordingToRoundResult() will be overwritten by updatePlayersAccordingToRoundResult()!!!
   */
  /*
  private updatePlayersAccordingToRoundResult(roundData: Round): Immutable.List<Player> {
    let tempPlayerList = this.players
    roundData.games.forEach(game => {
      if (game) {
        let redDiff, blackDiff, redResult, blackResult
        switch (game.result) {
          case '+':
            redDiff = this.winScore
            blackDiff = this.loseScore
            redResult = '+'
            blackResult = '-'
            break

          case '-':
            redDiff = this.loseScore
            blackDiff = this.winScore
            redResult = '-'
            blackResult = '+'
            break

          case '=':
            redDiff = this.drawScore
            blackDiff = this.drawScore
            redResult = '='
            blackResult = '='
            break

          default:
            throw new Error('IMPOSSIBLE! game is not finished!')
        }

        // CAUSION: we should get the player from the match again
        // it's possible that the players have been updated!!!
        let updatedRedPlayer: Player = game.redPlayer
        let updatedBlackPlayer: Player = game.blackPlayer
        // update the red player if not a fake player
        if (updatedRedPlayer.number !== 0) {
          updatedRedPlayer = updatedRedPlayer.setScore(updatedRedPlayer.score + redDiff)
          updatedRedPlayer = updatedRedPlayer.addPlayedOpponent(game.blackPlayer)
          updatedRedPlayer = updatedRedPlayer.addPlayedSide('red')
          updatedRedPlayer = updatedRedPlayer.addPlayedResult(redResult)
        }

        // update the black player if not a fake player
        if (updatedBlackPlayer.number !== 0) {
          updatedBlackPlayer = updatedBlackPlayer.setScore(game.blackPlayer.score + blackDiff)
          updatedBlackPlayer = updatedBlackPlayer.addPlayedOpponent(game.redPlayer) // we should use game.redPlayer here!!!
          updatedBlackPlayer = updatedBlackPlayer.addPlayedSide('black')
          updatedBlackPlayer = updatedBlackPlayer.addPlayedResult(blackResult)
        }

        // update the players to the player list
        if (updatedRedPlayer.number !== 0) {
          const redPlayerIndex = tempPlayerList.findIndex(v => (v ? v.number === updatedRedPlayer.number : false))
          if (redPlayerIndex === -1) {
            throw new Error(`IMPOSSIBLE! failed to find the player with number "${updatedRedPlayer.number}"`)
          }
          tempPlayerList = tempPlayerList.set(redPlayerIndex, updatedRedPlayer)
        }
        if (updatedBlackPlayer.number !== 0) {
          const blackPlayerIndex = tempPlayerList.findIndex(v => (v ? v.number === updatedBlackPlayer.number : false))
          if (blackPlayerIndex === -1) {
            throw new Error(`IMPOSSIBLE! failed to find the player with number "${updatedBlackPlayer.number}"`)
          }
          tempPlayerList = tempPlayerList.set(blackPlayerIndex, updatedBlackPlayer)
        }
      } else {
        throw new Error('IMPOSSIBLE! game is undefined!')
      }
    })

    return tempPlayerList
  }

  private updateOpponentScoreOfPlayers(playerList: Immutable.List<Player>): Immutable.List<Player> {
    let tempPlayerList = players
    for (let index = 0; index < players.size; index++) {
      let player = players.get(index)
      if (player && player.number !== 0) {
        let score = 0
        player.playedOpponents.forEach(opponent => {
          if (opponent && opponent.number !== 0) {
            // this opponent has been updated, and his/her latest information need to be fechted
            const uptodatePlayer = this.getPlayerByNumber(opponent.number) as Player
            score += uptodatePlayer.score
          }
        })

        player = player.setOpponentScore(score)
        tempPlayerList = tempPlayerList.set(index, player)
      }
    }

    return tempPlayerList
  }
  */

  private updateOpponentScoreOfPlayersV2(playerList: Immutable.List<Player>): Immutable.List<Player> {
    let tempPlayerList = playerList
    for (let index = 0; index < tempPlayerList.size; index++) {
      let player = tempPlayerList.get(index)
      if (player && player.number !== 0) {
        let opponentScore = this.calculateOpponentScoreForPlayer(player, tempPlayerList)
        player = player.setOpponentScore(opponentScore)
        tempPlayerList = tempPlayerList.set(index, player)
      }
    }

    return tempPlayerList
  }

  private calculateOpponentScoreForPlayer(player: Player, playerList: Immutable.List<Player>): number {
    if (player.number <= 0) {
      throw new Error(`UNEXPECTED! Try to get opponent score for a player with number "${player.number}"`)
    }

    let opponentScore = 0
    player.playedOpponents.forEach(opponent => {
      if (opponent && opponent.number !== 0) {
        const opponentIndex = playerList.findIndex(v => (v ? v.number === opponent.number : false))
        if (opponentIndex === -1) {
          throw new Error(`UNEXPECTED! failed to find the opponent with number "${opponent.number}"`)
        }
        let uptodateOpponent = playerList.get(opponentIndex)
        opponentScore += uptodateOpponent.score
      }
    })

    return opponentScore
  }

  public setLoseScore(loseScore: number): this {
    return this.set('loseScore', loseScore) as this
  }

  public setWinScore(winScore: number): this {
    return this.set('winScore', winScore) as this
  }

  public setDrawScore(drawScore: number): this {
    return this.set('drawScore', drawScore) as this
  }

  public setJudge(judge: string): this {
    return this.set('judge', judge) as this
  }

  public setArranger(arranger: string): this {
    return this.set('arranger', arranger) as this
  }

  public setNote(note: string): this {
    return this.set('note', note) as this
  }

  public changePlayerInGame(table: number, currentPlayerNumber: number, withPlayerNumber: number): this {
    if (currentPlayerNumber === withPlayerNumber) {
      return this
    }

    let roundData = this.getRoundData(this.currentRound)
    const gameIndex = table - 1
    let game: Game = roundData.games.get(gameIndex)

    if (game === undefined) {
      throw new Error(`UNEXPECTED! Cannot find the table ${table}`)
    }

    const otherGameIndex = roundData.games.findIndex(
      (game: Game) => game.redPlayer.number === withPlayerNumber || game.blackPlayer.number === withPlayerNumber
    )
    if (otherGameIndex === -1) {
      throw new Error(`UNEXPECTED! Cannot find the table which has the player with number ${withPlayerNumber}`)
    }

    let otherGame = roundData.games.get(otherGameIndex)

    let redPlayerForCurrentTable, blackPlayerForCurrentTable, redPlayerForOtherTable, blackPlayerForOtherTable

    if (otherGameIndex !== gameIndex) {
      // we are exchanging two players from different tables
      if (currentPlayerNumber === game.redPlayer.number) {
        blackPlayerForCurrentTable = game.blackPlayer
        if (withPlayerNumber === otherGame.redPlayer.number) {
          redPlayerForCurrentTable = otherGame.redPlayer
          redPlayerForOtherTable = game.redPlayer
          blackPlayerForOtherTable = otherGame.blackPlayer
        } else {
          redPlayerForOtherTable = otherGame.redPlayer
          redPlayerForCurrentTable = otherGame.blackPlayer
          blackPlayerForOtherTable = game.redPlayer
        }
      } else {
        redPlayerForCurrentTable = game.redPlayer
        if (withPlayerNumber === otherGame.redPlayer.number) {
          blackPlayerForCurrentTable = otherGame.redPlayer
          redPlayerForOtherTable = game.blackPlayer
          blackPlayerForOtherTable = otherGame.blackPlayer
        } else {
          redPlayerForOtherTable = otherGame.redPlayer
          blackPlayerForCurrentTable = otherGame.blackPlayer
          blackPlayerForOtherTable = game.blackPlayer
        }
      }

      const newGame = new Game(game.table, redPlayerForCurrentTable, blackPlayerForCurrentTable)
      let games = roundData.games.set(gameIndex, newGame)
      roundData = roundData.set('games', games) as Round

      const newOtherGame = new Game(otherGame.table, redPlayerForOtherTable, blackPlayerForOtherTable)
      games = roundData.games.set(otherGameIndex, newOtherGame)
      roundData = roundData.set('games', games) as Round
    } else {
      // we are exchanging the two players in the same table
      redPlayerForCurrentTable = game.blackPlayer
      blackPlayerForCurrentTable = game.redPlayer
      const newGame = new Game(game.table, redPlayerForCurrentTable, blackPlayerForCurrentTable)
      let games = roundData.games.set(gameIndex, newGame)
      roundData = roundData.set('games', games) as Round
    }

    return this.setCurrentRoundPairring(roundData)
  }

  public resetPairing(): this {
    return this.updateOpponentsPairting()
  }
}
