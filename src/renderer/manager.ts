/**
 * The app manager.
 * It takes care of everything:
 *  * what popups are open, window active or not, ...
 *  * all actions
 *  * state of the app
 *  * anything else
 */

import * as assert from 'assert'
import * as Electron from 'electron'
import { App } from '../renderer/app'
import { Player } from '../common/immutable-player'
import { MatchStore } from './match-store'
import { ImmutableMatch, MAXIMUM_TOTAL_ROUNDS } from '../common/immutable-match'
import { getFileName } from '../common/helper-functions'

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
  private static instance: Manager
  private contentToPrint: any
  private openDialogs: PopupType[]
  private app?: App
  private matchStore: MatchStore
  private playerToDeleteOrEdit: number | undefined
  private currentFile: string | undefined
  private lastSavedMatch: ImmutableMatch

  private constructor() {
    this.openDialogs = []
    this.matchStore = new MatchStore()
    this.closeMatch()
  }

  public static getManager(): Manager {
    if (Manager.instance === undefined) {
      Manager.instance = new Manager()
    }

    return Manager.instance
  }

  public getMatch(): ImmutableMatch {
    return this.matchStore.getMatch()
  }

  /**
   * true: OK to proceed
   * false: NOK, user cancel, so caller should stop current action
   */
  public closeCurrentMatch(): boolean {
    // check if the current match need to be save or not
    const match = this.matchStore.getMatch()
    if (match.name !== '') {
      if (this.currentFile === undefined || this.lastSavedMatch !== match) {
        const options = {
          type: 'warning',
          buttons: ['保存', '不保存', '取消'],
          message: `要保存当前的比赛"${match.name}"吗？`,
        }
        const response = Electron.remote.dialog.showMessageBox(Electron.remote.getCurrentWindow(), options)
        if (response === 2) {
          return false
        }

        if (response === 0) {
          this.saveMatch()
        }
        this.closeMatch()
      } else {
        this.closeMatch()
      }
    }

    return true
  }

  private closeMatch() {
    this.matchStore.closeMatch()
    this.contentToPrint = undefined
    this.currentFile = undefined
    this.lastSavedMatch = this.matchStore.getMatch()
    this.updateAppState()
    this.updateWindowTitle()
  }

  public saveMatch() {
    if (this.currentFile === undefined) {
      const options = {
        defaultPath: this.matchStore.getMatch().name,
        filters: [{ name: 'JSON 文件', extensions: ['json'] }],
      }
      /* show a file-open dialog and read the first selected file */
      var fileName = Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), options)
      if (fileName) {
        this.currentFile = fileName
        this.updateWindowTitle()
        this.matchStore.saveMatch(this.currentFile)
        this.lastSavedMatch = this.matchStore.getMatch()
      }
    } else {
      if (this.lastSavedMatch !== this.matchStore.getMatch()) {
        this.matchStore.saveMatch(this.currentFile)
        this.lastSavedMatch = this.matchStore.getMatch()
      }
    }
  }

  public loadMatch() {
    /* show a file-open dialog and read the first selected file */
    var fileNames = Electron.remote.dialog.showOpenDialog(Electron.remote.getCurrentWindow(), {
      properties: ['openFile'],
      filters: [{ name: 'JSON 文件', extensions: ['json'] }],
    })

    if (fileNames) {
      if (this.matchStore.loadMatch(fileNames[0]) === 0) {
        this.currentFile = fileNames[0]
        this.lastSavedMatch = this.matchStore.getMatch()
        this.updateWindowTitle()
        this.updateAppState()
      } else {
        const options = {
          type: 'warning',
          buttons: ['OK'],
          message: `加载失败，"${getFileName(fileNames[0])}"不是一个合法的比赛文件！`,
        }
        Electron.remote.dialog.showMessageBox(Electron.remote.getCurrentWindow(), options)
      }
    }
  }

  private updateWindowTitle() {
    let title: string = Electron.remote.app.getName()
    /*
    const match = this.props.manager.getMatch()
    if (match.name !== '') {
      title = match.name
    }
    */
    const match = this.matchStore.getMatch()
    if (match.name !== '') {
      if (this.currentFile) {
        title += ' - ' + getFileName(this.currentFile)
      } else {
        title += ' - ' + '未命名.json'
      }
    }
    if (title !== Electron.remote.getCurrentWindow().getTitle()) {
      Electron.remote.getCurrentWindow().setTitle(title)
    }
  }

  public newMatch(match: ImmutableMatch) {
    this.matchStore.newMatch(match)
    this.updateAppState()
    this.updateWindowTitle()
  }

  public updateMatch(match: ImmutableMatch) {
    this.matchStore.updateMatch(match)
    this.updateAppState()
  }

  public print(contentToPrint: any) {
    this.contentToPrint = contentToPrint
    this.updateAppState()
  }

  public getPrintContent() {
    return this.contentToPrint
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
  public updatePlayer(
    currentNumber: number,
    newNumber: number,
    name: string,
    organization: string = '',
    note: string = ''
  ) {
    if (currentNumber !== this.playerToDeleteOrEdit) {
      throw new Error('UNEXPECTED! playerToDeleteOrEdit is undefined')
    }
    this.matchStore.updatePlayer(currentNumber, newNumber, name, organization, note)
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
        if (dialog !== PopupType.EditPlayer && this.openDialogs[this.openDialogs.length - 1] === PopupType.AddPlayer) {
          // we used the edit player when adding new player
          assert.ok(false, `"${dialog}" is NOT same as last one: "${this.openDialogs[this.openDialogs.length - 1]}"`)
        }
      }
    }
    this.openDialogs.pop()
    this.updateAppState()
  }

  /**
   * create a new match and then work on the new match
   * @param match the new ImmutableMatch
   */
  /*
  public newMatch(name: string, totalRounds: number, organizer: string = '') {
    if (true) {
      // do somethign with the current match?
    }

    this.matchStore.newMatch(name, totalRounds, organizer)
    this.updateAppState()
  }
  */

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
      this.app.update()
    }
  }

  /**
   * create a new match and then work on the new match
   * @param match the new ImmutableMatch
   */
  public addPlayer(name: string, organization: string = '', note: string = '', preferredNumber?: number) {
    this.matchStore.addPlayer(name, organization, note, preferredNumber)

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

  /*
  public setCurrentRoundPairring(roundData: Round) {
    this.matchStore.setCurrentRoundPairring(roundData)
    this.updateAppState()
  }
  */

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

  public changePlayerInGame(table: number, currentPlayerNumber: number, withPlayerNumber: number) {
    this.matchStore.changePlayerInGame(table, currentPlayerNumber, withPlayerNumber)
    this.updateAppState()
  }

  public resetPairing() {
    this.matchStore.resetPairing()
    this.updateAppState()
  }
}
