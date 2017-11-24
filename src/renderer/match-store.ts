import * as fs from 'fs'
import { ImmutableMatch } from '../common/immutable-match'

export enum MatchActionType {
  SetName = 1,
  SetOrganizer,
  SetTotalRounds,
  AddPlayer,
  UpdatePlayer,
  RemovePlayer,
  RemoveAllPlayer,
  UpdateTableResult,
  StartCurrentRound,
  StartMatch,
  EndCurrentRound,
  ChangePlayerInGame,
  ResetPairing,
}

export interface MatchAction {
  type: MatchActionType
  actionPara: any
}

export class MatchStore {
  match: ImmutableMatch
  actionHistory: MatchAction[]

  constructor() {
    this.match = new ImmutableMatch()
    this.actionHistory = []
  }

  private doMatchAction(action: MatchAction): void {
    this.actionHistory.push(action)

    switch (action.type) {
      case MatchActionType.SetName:
        this.match = this.match.setName(action.actionPara)
        break

      case MatchActionType.SetOrganizer:
        this.match = this.match.setOrganizer(action.actionPara)
        break

      case MatchActionType.SetTotalRounds:
        this.match = this.match.setTotalRounds(action.actionPara)
        break

      case MatchActionType.AddPlayer:
        this.match = this.match.addPlayer(
          action.actionPara.name,
          action.actionPara.organization,
          action.actionPara.note,
          action.actionPara.preferredNumber
        )
        break

      case MatchActionType.UpdatePlayer:
        this.match = this.match.updatePlayer(
          action.actionPara.currentNumber,
          action.actionPara.newNumber,
          action.actionPara.name,
          action.actionPara.organization,
          action.actionPara.note
        )
        break

      case MatchActionType.RemovePlayer:
        this.match = this.match.removePlayer(action.actionPara)
        break

      case MatchActionType.RemoveAllPlayer:
        this.match = this.match.removeAllPlayers()
        break

      case MatchActionType.UpdateTableResult:
        this.match = this.match.updateTableResult(
          action.actionPara.round,
          action.actionPara.table,
          action.actionPara.result
        )
        break

      case MatchActionType.StartCurrentRound:
        this.match = this.match.startCurrentRound(action.actionPara)
        break

      case MatchActionType.EndCurrentRound:
        this.match = this.match.endCurrentRound(action.actionPara)
        break

      case MatchActionType.StartMatch:
        this.match = this.match.start()
        break

      case MatchActionType.ResetPairing:
        this.match = this.match.resetPairing()
        break

      case MatchActionType.ChangePlayerInGame:
        this.match = this.match.changePlayerInGame(
          action.actionPara.table,
          action.actionPara.currentPlayerNumber,
          action.actionPara.withPlayerNumber
        )
        break

      default:
        throw new Error('IMPOSSIBLE! unknown action!')
    }
  }

  public getMatch() {
    return this.match
  }

  public newMatch(name: string, totalRounds: number, organizer: string = '') {
    this.match = new ImmutableMatch()
    this.actionHistory = []
    this.setName(name)
    this.setTotalRounds(totalRounds)
    this.setOrganizer(organizer)
  }

  public setName(name: string) {
    this.doMatchAction({ type: MatchActionType.SetName, actionPara: name })
  }

  public setOrganizer(organizer: string) {
    this.doMatchAction({ type: MatchActionType.SetOrganizer, actionPara: organizer })
  }

  public setTotalRounds(totalRounds: number) {
    this.doMatchAction({ type: MatchActionType.SetTotalRounds, actionPara: totalRounds })
  }

  public addPlayer(name: string, organization: string = '', note: string = '', preferredNumber?: number) {
    this.doMatchAction({ type: MatchActionType.AddPlayer, actionPara: { name, organization, note, preferredNumber } })
  }

  public updatePlayer(
    currentNumber: number,
    newNumber: number,
    name: string,
    organization: string = '',
    note: string = ''
  ) {
    this.doMatchAction({
      type: MatchActionType.UpdatePlayer,
      actionPara: { currentNumber, newNumber, name, organization, note },
    })
  }

  public removePlayer(number: number) {
    this.doMatchAction({ type: MatchActionType.RemovePlayer, actionPara: number })
  }

  public removeAllPlayers() {
    this.doMatchAction({ type: MatchActionType.RemoveAllPlayer, actionPara: undefined })
  }

  public updateTableResult(round: number, table: number, result: string) {
    this.doMatchAction({ type: MatchActionType.UpdateTableResult, actionPara: { round, table, result } })
  }

  public startCurrentRound(currentRound: number) {
    this.doMatchAction({ type: MatchActionType.StartCurrentRound, actionPara: currentRound })
  }

  public start() {
    this.doMatchAction({ type: MatchActionType.StartMatch, actionPara: undefined })
  }

  public endCurrentRound(currentRound: number) {
    this.doMatchAction({ type: MatchActionType.EndCurrentRound, actionPara: currentRound })
  }

  public changePlayerInGame(table: number, currentPlayerNumber: number, withPlayerNumber: number) {
    this.doMatchAction({
      type: MatchActionType.ChangePlayerInGame,
      actionPara: { table, currentPlayerNumber, withPlayerNumber },
    })
  }

  public saveMatch(fileName: string): void {
    fs.writeFileSync(fileName, JSON.stringify(this.actionHistory))
  }

  public loadMatch(fileName: string): void {
    // we should do something like ask user to save the current match

    // move a new match
    this.match = new ImmutableMatch()
    this.actionHistory = []
    const actionHistory: MatchAction[] = JSON.parse(fs.readFileSync(fileName, 'utf8'))
    for (let index = 0; index < actionHistory.length; index++) {
      this.doMatchAction(actionHistory[index])
    }
  }

  public resetPairing() {
    this.doMatchAction({
      type: MatchActionType.ResetPairing,
      actionPara: undefined,
    })
  }
}
