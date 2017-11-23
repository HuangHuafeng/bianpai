import * as Immutable from 'immutable'

let PlayerRecord = Immutable.Record({
  number: 0,
  name: '',
  organization: '',
  note: '',
  score: 0,
  opponentScore: 0,
  playedOpponents: Immutable.List(),
  playedSides: Immutable.List(),
  playedResults: Immutable.List(),
})

export class Player extends PlayerRecord {
  number: number
  name: string
  organization: string
  note: string
  score: number
  opponentScore: number
  playedOpponents: Immutable.List<Player>
  playedSides: Immutable.List<string>
  playedResults: Immutable.List<string>

  constructor(number: number, name: string, organization: string = '', note: string = '', score: number = 0) {
    super({ number, name, organization, note, score })
  }

  public setNumber(number: number): this {
    return this.set('number', number) as this
  }

  public setName(name: string): this {
    return this.set('name', name) as this
  }

  public setOrganization(organization: string): this {
    return this.set('organization', organization) as this
  }

  public setNote(note: string): this {
    return this.set('note', note) as this
  }

  public setScore(score: number): this {
    return this.set('score', score) as this
  }

  public setOpponentScore(opponentScore: number): this {
    return this.set('opponentScore', opponentScore) as this
  }

  public addPlayedOpponent(opponent: Player): this {
    const playedOpponents = this.playedOpponents.push(opponent)
    return this.set('playedOpponents', playedOpponents) as this
  }

  public addPlayedSide(side: string): this {
    const playedSides = this.playedSides.push(side)
    return this.set('playedSides', playedSides) as this
  }

  public addPlayedResult(result: string): this {
    const playedResults = this.playedResults.push(result)
    return this.set('playedResults', playedResults) as this
  }

  public hasPlayedWith(player: Player): boolean {
    return this.playedOpponents.findIndex(v => (v ? v.number === player.number : false)) !== -1
  }
}
