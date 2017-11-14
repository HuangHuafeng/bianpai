import * as clone from 'clone'

class PlayerRoundData {
  opponent: any
}

class PlayerMatchData {
  score: number // score in match
  sides: string[] // 红方，黑方
  opponents: any // array of Player or undefine
}

export class Player {
  private number: number
  private name: string
  private organization: string
  private matchData: PlayerMatchData

  constructor(number: number, name: string, organization: string = '') {
    this.number = number
    this.name = name
    this.organization = organization
    this.matchData = {
      score: 0,
      sides: [],
      opponents: [],
    }
  }

  public getScore(): number {
    return this.matchData.score
  }

  public setScore(score: number) {
    this.matchData.score = score
  }

  public getOpponents(): any {
    return clone(this.matchData.opponents)
  }

  public setOpponents(opponents: Player[]) {
    this.matchData.opponents = clone(opponents)
  }

  public getSides(): string[] {
    return clone(this.matchData.sides)
  }

  public setSides(sides: string[]) {
    this.matchData.sides = clone(sides)
  }

  public getName() {
    return this.name
  }

  public setName(name: string) {
    if (name.length === 0) {
      throw new Error('name is empty!')
    }

    this.name = name
  }

  public getNumber() {
    return this.number
  }

  public setNumber(number: number) {
    if (number <= 0) {
      throw new Error('number is less than or equal to 0!')
    }

    this.number = number
  }

  public getOrganization() {
    return this.organization
  }

  public setOrganization(organization: string) {
    this.organization = organization
  }
}
