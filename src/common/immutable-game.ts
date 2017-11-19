import * as Immutable from 'immutable'
import { Player } from './immutable-player'

let GameRecord = Immutable.Record({
  table: 0,
  redPlayer: new Player(0, ''),
  blackPlayer: new Player(0, ''),
  result: '?',
})

export class Game extends GameRecord {
  table: number
  redPlayer: Player
  blackPlayer: Player
  result: string // '+' for red wins, '-' for black wins, '=' for draw, '?' or undefined for not known

  constructor(table: number, redPlayer: Player, blackPlayer: Player, result: string = '?') {
    super({ table, redPlayer, blackPlayer, result })
  }

  public updateTable(table: number): this {
    if (table <= 0) {
      throw new Error('UNEXPECTED! cannot set a table number to 0 or less!')
    }

    return this.set('table', table) as this
  }
}
