/**
 * The app manager.
 * It takes care of everything:
 *  * what popups are open, window active or not, ...
 *  * all actions
 *  * state of the app
 *  * anything else
 */

import { App } from './app'
import * as assert from 'assert'
import { Player } from '../common/immutable-player'
import { Round } from '../common/immutable-round'
import { MatchStore } from './match-store'
import { ImmutableMatch, MAXIMUM_TOTAL_ROUNDS } from '../common/immutable-match'

export enum PopupType {
  About = 1,
  NewMatch,
  AddPlayer,
  RemovePlayer,
  EditPlayer,
  EditMatch,
  RemoveAllPlayers,
}

export class Manager {
  private openDialogs: PopupType[]
  private app?: App
  private matchStore: MatchStore
  private playerToDeleteOrEdit: number | undefined

  constructor() {
    this.openDialogs = []
    this.matchStore = new MatchStore()
  }

  public getMatch(): ImmutableMatch {
    return this.matchStore.getMatch()
  }

  public updateMatch(match: ImmutableMatch) {
    // TODO
  }

  public getOpenDialogs() {
    return this.openDialogs
  }

  public getMaximumTotalRounds() {
    return MAXIMUM_TOTAL_ROUNDS
  }

  /**
   * get the player that is to be deleted or edited
   */
  public getPlayerToDeleteOrEdit(): Player | undefined {
    if (this.playerToDeleteOrEdit !== undefined) {
      return this.matchStore.getMatch().getPlayerByNumber(this.playerToDeleteOrEdit)
    }

    return undefined
  }

  /**
   * update a player.
   * @param number
   * @param player
   */
  public updatePlayer(number: number, player: Player) {
    if (number !== this.playerToDeleteOrEdit) {
      throw new Error('UNEXPECTED! playerToDeleteOrEdit is undefined')
    }
    this.matchStore.updatePlayer(number, player)
  }

  /**
   * check if the "dialog" dialog is already open. We don't want to open the same dialog
   * because it can cause issues (like duplicated key, id of the dialog element).
   * @param dialog the dialog to be checked
   */
  private isDialogAlreadyOpen(dialog: PopupType): boolean {
    return this.openDialogs.findIndex(value => value === dialog) !== -1
  }

  /**
   * Just dismiss (only) the top dialog, do nothing else
   * @param dialog the dialog justed submitted
   */
  public onPopupDismissed(dialog: PopupType): void {
    switch (dialog) {
      case PopupType.About:
        return this.closeTopDialog(dialog)

      case PopupType.NewMatch:
        return this.closeTopDialog(dialog)

      case PopupType.AddPlayer:
        return this.closeTopDialog(dialog)

      case PopupType.RemovePlayer:
        this.playerToDeleteOrEdit = undefined
        return this.closeTopDialog(dialog)

      case PopupType.EditPlayer:
        this.playerToDeleteOrEdit = undefined
        return this.closeTopDialog(dialog)

      case PopupType.EditMatch:
        return this.closeTopDialog(dialog)

      case PopupType.RemoveAllPlayers:
        return this.closeTopDialog(dialog)

      default:
        assert.ok(false, `Unknown value: "${dialog}"`)
        return
    }
  }

  public showPopup(dialog: PopupType) {
    if (!this.isDialogAlreadyOpen(dialog)) {
      this.openDialogs.push(dialog)
      this.updateAppState()
    }
  }

  /**
   *
   * @param dialog must be equal to the top/last dialog
   */
  private closeTopDialog(dialog?: PopupType) {
    if (dialog) {
      if (dialog !== this.openDialogs[this.openDialogs.length - 1]) {
        assert.ok(false, `"${dialog}" is NOT same as last one: "${this.openDialogs[this.openDialogs.length - 1]}"`)
      }
    }
    this.openDialogs.pop()
    this.updateAppState()
  }

  /**
   * create a new match and then work on the new match
   * @param match the new ImmutableMatch
   */
  public newMatch(name: string, totalRounds: number, organizer: string = '') {
    if (true) {
      // do somethign with the current match?
    }

    this.matchStore.newMatch(name, totalRounds, organizer)
    this.updateAppState()
  }

  /**
   * We can only manage one app and it can NOT be changed
   * @param app the app that is managed by this manager
   */
  public registerApp(app: App) {
    if (this.app === undefined) {
      this.app = app
      // probably it's not a good idea to call update app state here
      //this.updateAppState()
    }
  }

  private updateAppState() {
    if (this.app !== undefined) {
      let state = { match: this.matchStore.getMatch() }
      this.app.setState(state)
    }
  }

  /**
   * create a new match and then work on the new match
   * @param match the new ImmutableMatch
   */
  public addPlayer(name: string, organization: string = '') {
    this.matchStore.addPlayer(name, organization)

    this.updateAppState()
  }

  /**
   * remove the player with number "number", need further confirmation.
   */
  public removePlayer(number: number) {
    this.playerToDeleteOrEdit = number
    this.showPopup(PopupType.RemovePlayer)
  }

  /**
   * remove the player with number "number", this is after confirmation!
   * @param number
   */
  public removePlayerConfirmed(number: number) {
    if (number !== this.playerToDeleteOrEdit) {
      throw new Error('UNEXPECTED! number does NOT equal to playerToDeleteOrEdit.')
    }

    this.matchStore.removePlayer(number)
    this.updateAppState()
  }

  public editPlayer(number: number) {
    this.playerToDeleteOrEdit = number
    this.showPopup(PopupType.EditPlayer)
  }

  /**
   * remove all players, need further confirmation.
   */
  public removeAllPlayers() {
    this.showPopup(PopupType.RemoveAllPlayers)
  }

  /**
   * remove all players. this is after user confirmation!
   */
  public removeAllPlayersConfirmed() {
    this.matchStore.removeAllPlayers()
    this.updateAppState()
  }

  public startCurrentRound(currentRound: number) {
    this.matchStore.startCurrentRound(currentRound)
    this.updateAppState()
  }

  public setCurrentRoundPairring(roundData: Round) {
    this.matchStore.setCurrentRoundPairring(roundData)
    this.updateAppState()
  }

  public updateTableResult(round: number, table: number, result: string) {
    this.matchStore.updateTableResult(round, table, result)
    this.updateAppState()
  }

  public startMatch() {
    this.matchStore.start()
    this.updateAppState()
  }

  public endCurrentRound() {
    const currentRound = this.matchStore.getMatch().currentRound
    this.matchStore.endCurrentRound(currentRound)
    this.updateAppState()
  }
}
