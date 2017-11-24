import * as fs from 'fs'
import * as crypto from 'crypto'
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
  parameter: any
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
        this.match = this.match.setName(action.parameter)
        break

      case MatchActionType.SetOrganizer:
        this.match = this.match.setOrganizer(action.parameter)
        break

      case MatchActionType.SetTotalRounds:
        this.match = this.match.setTotalRounds(action.parameter)
        break

      case MatchActionType.AddPlayer:
        this.match = this.match.addPlayer(
          action.parameter.name,
          action.parameter.organization,
          action.parameter.note,
          action.parameter.preferredNumber
        )
        break

      case MatchActionType.UpdatePlayer:
        this.match = this.match.updatePlayer(
          action.parameter.currentNumber,
          action.parameter.newNumber,
          action.parameter.name,
          action.parameter.organization,
          action.parameter.note
        )
        break

      case MatchActionType.RemovePlayer:
        this.match = this.match.removePlayer(action.parameter)
        break

      case MatchActionType.RemoveAllPlayer:
        this.match = this.match.removeAllPlayers()
        break

      case MatchActionType.UpdateTableResult:
        this.match = this.match.updateTableResult(
          action.parameter.round,
          action.parameter.table,
          action.parameter.result
        )
        break

      case MatchActionType.StartCurrentRound:
        this.match = this.match.startCurrentRound(action.parameter)
        break

      case MatchActionType.EndCurrentRound:
        this.match = this.match.endCurrentRound(action.parameter)
        break

      case MatchActionType.StartMatch:
        this.match = this.match.start()
        break

      case MatchActionType.ResetPairing:
        this.match = this.match.resetPairing()
        break

      case MatchActionType.ChangePlayerInGame:
        this.match = this.match.changePlayerInGame(
          action.parameter.table,
          action.parameter.currentPlayerNumber,
          action.parameter.withPlayerNumber
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
    this.doMatchAction({ type: MatchActionType.SetName, parameter: name })
  }

  public setOrganizer(organizer: string) {
    this.doMatchAction({ type: MatchActionType.SetOrganizer, parameter: organizer })
  }

  public setTotalRounds(totalRounds: number) {
    this.doMatchAction({ type: MatchActionType.SetTotalRounds, parameter: totalRounds })
  }

  public addPlayer(name: string, organization: string = '', note: string = '', preferredNumber?: number) {
    this.doMatchAction({ type: MatchActionType.AddPlayer, parameter: { name, organization, note, preferredNumber } })
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
      parameter: { currentNumber, newNumber, name, organization, note },
    })
  }

  public removePlayer(number: number) {
    this.doMatchAction({ type: MatchActionType.RemovePlayer, parameter: number })
  }

  public removeAllPlayers() {
    this.doMatchAction({ type: MatchActionType.RemoveAllPlayer, parameter: undefined })
  }

  public updateTableResult(round: number, table: number, result: string) {
    this.doMatchAction({ type: MatchActionType.UpdateTableResult, parameter: { round, table, result } })
  }

  public startCurrentRound(currentRound: number) {
    this.doMatchAction({ type: MatchActionType.StartCurrentRound, parameter: currentRound })
  }

  public start() {
    this.doMatchAction({ type: MatchActionType.StartMatch, parameter: undefined })
  }

  public endCurrentRound(currentRound: number) {
    this.doMatchAction({ type: MatchActionType.EndCurrentRound, parameter: currentRound })
  }

  public changePlayerInGame(table: number, currentPlayerNumber: number, withPlayerNumber: number) {
    this.doMatchAction({
      type: MatchActionType.ChangePlayerInGame,
      parameter: { table, currentPlayerNumber, withPlayerNumber },
    })
  }

  public saveMatch(fileName: string): void {
    const conetentToSave = this.generateSaveContent(this.actionHistory)
    fs.writeFileSync(fileName, JSON.stringify(conetentToSave))
  }

  /**
   * 0  successfully load a match from the file
   * !0 failed to load the file
   * @param fileName
   */
  public loadMatch(fileName: string): number {
    const contentFromFile = JSON.parse(fs.readFileSync(fileName, 'utf8'))
    if (this.isValidSaveContent(contentFromFile) === false) {
      console.log('file content is not valid')
      return 1
    }

    // we should do something like ask user to save the current match

    // move a new match
    this.match = new ImmutableMatch()
    this.actionHistory = []
    const actionHistory: MatchAction[] = contentFromFile.content
    for (let index = 0; index < actionHistory.length; index++) {
      this.doMatchAction(actionHistory[index])
    }

    return 0
  }

  private generateSaveContent(contentToSave: any) {
    const hashSha256OfContent = crypto.createHash('sha256').update(JSON.stringify(contentToSave))

    return {
      content: contentToSave,
      digest: hashSha256OfContent.digest('hex'),
    }
  }

  public isValidSaveContent(saveContent: any): boolean {
    if (saveContent.digest === undefined || saveContent.content === undefined) {
      return false
    }
    const tempSaveContent = this.generateSaveContent(saveContent.content)
    if (saveContent.digest !== tempSaveContent.digest) {
      return false
    }

    return true
  }

  public resetPairing() {
    this.doMatchAction({
      type: MatchActionType.ResetPairing,
      parameter: undefined,
    })
  }
}
