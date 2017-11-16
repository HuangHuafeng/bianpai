import * as Immutable from 'immutable'

let PlayerRecord = Immutable.Record({
  number: 0,
  name: '',
  organization: '',
})

export class Player extends PlayerRecord {
  number: number
  name: string
  organization: string

  constructor(number: number, name: string, organization: string = '') {
    super({ number, name, organization })
  }
}
