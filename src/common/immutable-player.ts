import * as Immutable from 'immutable'

let PlayerRecord = Immutable.Record({
  number: 0,
  name: '',
  organization: '',
  score: 0,
  playedOpponents: Immutable.List(),
  playedSides: Immutable.List(),
})

export class Player extends PlayerRecord {
  number: number
  name: string
  organization: string
  score: number
  playedOpponents: Immutable.List<Player>
  playedSides: Immutable.List<string>

  constructor(number: number, name: string, organization: string = '', score: number = 0) {
    super({ number, name, organization, score })
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

  public setScore(score: number): this {
    return this.set('score', score) as this
  }

  public addPlayedOpponent(opponent: Player): this {
    const playedOpponents = this.playedOpponents.push(opponent)
    return this.set('playedOpponents', playedOpponents) as this
  }

  public addPlayedSides(side: string): this {
    const playedSides = this.playedSides.push(side)
    return this.set('playedSides', playedSides) as this
  }
}
