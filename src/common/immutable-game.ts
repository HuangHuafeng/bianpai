import * as Immutable from 'immutable'

let GameRecord = Immutable.Record({
  table: 0,
  redNumber: 0,
  blackNumber: 0,
  result: '?',
})

export class Game extends GameRecord {
  table: number
  redNumber: number
  blackNumber: number
  result: string // '+' for red wins, '-' for black wins, '=' for draw, '?' or undefined for not known

  constructor(table: number, redNumber: number, blackNumber: number, result: string = '?') {
    super({ table, redNumber, blackNumber, result })
  }
}
