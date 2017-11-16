/**
 * this is a test component, so I can try/test/learn:
 * 1. TypeScript
 * 2. Immutable
 * 3. ...
 */
import * as React from 'react'
import { Button } from 'react-bootstrap'
import { Manager } from './manager'
import { MatchStore } from './match-store'
import { ImmutableMatch } from '../common/immutable-match'

export enum PopupType {
  About = 1,
  NewMatch,
  AddPlayer,
  RemovePlayer,
  EditPlayer,
  EditMatch,
  RemoveAllPlayers,
}

interface ITestProps {
  readonly manager: Manager
  readonly match: ImmutableMatch
}

interface ITestState {}

export class Test extends React.Component<ITestProps, ITestState> {
  constructor(props: ITestProps) {
    super(props)
  }

  private printMatch(match: ImmutableMatch) {
    console.log(match)
    console.log(match.toJS())
  }

  private testCode = () => {
    let matchStroe: MatchStore = new MatchStore()
    matchStroe.setName('abc')
    matchStroe.addPlayer('player1', 'google')

    const match1 = matchStroe.getMatch()
    this.printMatch(match1)

    matchStroe.setName('match2')
    matchStroe.setTotalRounds(10)
    matchStroe.setOrganizer('Google')
    matchStroe.addPlayer('alpha', 'google')
    matchStroe.setTotalRounds(20)
    matchStroe.addPlayer('Xiaona', 'Microsoft')

    const match2 = matchStroe.getMatch()
    this.printMatch(match1)
    this.printMatch(match2)
    matchStroe.addPlayer('taxi', 'Uber')

    const match3 = matchStroe.getMatch()
    this.printMatch(match3)
    const match4 = match3.start()
    this.printMatch(match4)
    let player = match4.getPlayerByName('taxi')
    console.log(player)
    /*
    console.log('match1: ' + match1.name)
    console.log('match1: ' + match1.organizer)
    console.log('match1: ' + match1.totalRounds)
    console.log('match2: ' + match2.name)
    console.log('match2: ' + match2.organizer)
    console.log('match2: ' + match2.totalRounds)*/
  }

  public render() {
    return (
      <div id="test">
        {this.props.match.name}
        <Button bsStyle="primary" onClick={this.testCode}>
          TEST
        </Button>
      </div>
    )
  }
}
