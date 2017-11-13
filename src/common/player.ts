export class Player {
  private number: number
  private name: string
  private organization: string

  constructor(number: number, name: string, organization: string = '') {
    this.number = number
    this.name = name
    this.organization = organization
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
