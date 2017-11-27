import * as fs from 'fs'
import * as crypto from 'crypto'
import { ImmutableMatch } from '../common/immutable-match'
import { debugLog } from '../common/helper-functions'

const MatchActionType = {
  SetName: 'SET_NAME',
  SetOrganizer: 'SET_ORGANIZER',
  SetTotalRounds: 'SET_TOTAL_ROUNDS',
  SetWinScore: 'SET_WIN_SCORE',
  SetLoseScore: 'SET_LOSE_SCORE',
  SetDrawScore: 'SET_DRAW_SCORE',
  SetJudge: 'SET_JUDGE',
  SetArranger: 'SET_ARRANGER',
  SetNote: 'SET_NOTE',
  AddPlayer: 'ADD_PLAYER',
  UpdatePlayer: 'UPDATE_PLAYER',
  RemovePlayer: 'REMOVE_PLAYER',
  RemoveAllPlayer: 'REMOVE_ALL_PLAYERS',
  UpdateTableResult: 'UPDATE_TABLE_RESULT',
  StartCurrentRound: 'START_CURRENT_ROUND',
  StartMatch: 'START_MATCH',
  EndCurrentRound: 'END_CURRENT_ROUND',
  ChangePlayerInGame: 'CHANGE_PLAYER_IN_GAME',
  ResetPairing: 'RESET_PAIRING',
}

export interface MatchAction {
  type: string
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

      case MatchActionType.SetJudge:
        this.match = this.match.setJudge(action.parameter)
        break

      case MatchActionType.SetArranger:
        this.match = this.match.setArranger(action.parameter)
        break

      case MatchActionType.SetNote:
        this.match = this.match.setNote(action.parameter)
        break

      case MatchActionType.SetTotalRounds:
        this.match = this.match.setTotalRounds(action.parameter)
        break

      case MatchActionType.SetWinScore:
        this.match = this.match.setWinScore(action.parameter)
        break

      case MatchActionType.SetLoseScore:
        this.match = this.match.setLoseScore(action.parameter)
        break

      case MatchActionType.SetDrawScore:
        this.match = this.match.setDrawScore(action.parameter)
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

  public updateMatch(match: ImmutableMatch) {
    // we should not just replace the match!!! Instead we should update the current match
    if (this.match.name !== match.name) {
      this.setName(match.name)
    }
    if (this.match.organizer !== match.organizer) {
      this.setOrganizer(match.organizer)
    }
    if (this.match.totalRounds !== match.totalRounds) {
      this.setTotalRounds(match.totalRounds)
    }
    if (this.match.winScore !== match.winScore) {
      this.setWinScore(match.winScore)
    }
    if (this.match.loseScore !== match.loseScore) {
      this.setLoseScore(match.loseScore)
    }
    if (this.match.drawScore !== match.drawScore) {
      this.setDrawScore(match.drawScore)
    }
    if (this.match.judge !== match.judge) {
      this.setJudge(match.judge)
    }
    if (this.match.arranger !== match.arranger) {
      this.setArranger(match.arranger)
    }
    if (this.match.note !== match.note) {
      this.setNote(match.note)
    }
  }

  /*
  public newMatch(name: string, totalRounds: number, organizer: string = '') {
    this.match = new ImmutableMatch()
    this.actionHistory = []
    this.setName(name)
    this.setTotalRounds(totalRounds)
    this.setOrganizer(organizer)
  }
  */

  public setName(name: string) {
    this.doMatchAction({ type: MatchActionType.SetName, parameter: name })
  }

  public setOrganizer(organizer: string) {
    this.doMatchAction({ type: MatchActionType.SetOrganizer, parameter: organizer })
  }

  public setTotalRounds(totalRounds: number) {
    this.doMatchAction({ type: MatchActionType.SetTotalRounds, parameter: totalRounds })
  }

  public setWinScore(winScore: number) {
    this.doMatchAction({ type: MatchActionType.SetWinScore, parameter: winScore })
  }

  public setLoseScore(loseScore: number) {
    this.doMatchAction({ type: MatchActionType.SetLoseScore, parameter: loseScore })
  }

  public setDrawScore(drawScore: number) {
    this.doMatchAction({ type: MatchActionType.SetDrawScore, parameter: drawScore })
  }

  public setJudge(judge: string) {
    this.doMatchAction({ type: MatchActionType.SetJudge, parameter: judge })
  }

  public setArranger(arranger: string) {
    this.doMatchAction({ type: MatchActionType.SetArranger, parameter: arranger })
  }

  public setNote(note: string) {
    this.doMatchAction({ type: MatchActionType.SetNote, parameter: note })
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
      debugLog('file content is not valid')
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
