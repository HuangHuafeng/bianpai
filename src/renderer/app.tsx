import * as React from 'react'
import * as Electron from 'electron'
import * as assert from 'assert'
import { MenuEvent } from '../common/menu-event'
import { About } from './about'
import { Manager, PopupType } from './manager'
import { EditMatch } from './edit-match'
import { MatchView } from './matchview/match-view'
import { RemovePlayer } from './remove-player'
import { EditPlayer } from './edit-player'
import { RemoveAllPlayers } from './remove-all-players'
import { PrintView } from './print-view'

const notImplemented = (name: string) => {
  const options = {
    type: 'info',
    title: 'Sorry',
    buttons: ['Ok'],
    message: `"${name}" is not implemented yet. It will come.`,
  }
  Electron.remote.dialog.showMessageBox(Electron.remote.getCurrentWindow(), options)
}

export interface IAppProps {
  readonly manager: Manager
}

interface IAppState {}

export class App extends React.Component<IAppProps, IAppState> {
  public constructor(props: IAppProps) {
    super(props)

    Electron.ipcRenderer.on('menu-event', (event: Electron.IpcMessageEvent, { name }: { name: MenuEvent }) => {
      this.onMenuEvent(name)
    })
  }

  public componentDidMount() {
    this.props.manager.registerApp(this)
  }

  /**
   * Handles menu events
   * @param event menu event
   */
  private onMenuEvent(event: MenuEvent) {
    switch (event) {
      case 'show-about':
        return this.props.manager.showPopup(PopupType.About)

      case 'file-new':
        return this.props.manager.showPopup(PopupType.NewMatch)

      case 'add-player':
        return this.props.manager.showPopup(PopupType.AddPlayer)

      case 'edit-match':
        return this.props.manager.showPopup(PopupType.EditMatch)

      case 'remove-all-players':
        return this.props.manager.showPopup(PopupType.RemoveAllPlayers)

      case 'file-save':
        return this.saveMatch()

      case 'file-open':
        return this.loadMatch()

      default:
        return notImplemented(event)
    }
  }

  private loadMatch() {
    /* show a file-open dialog and read the first selected file */
    var fileNames = Electron.remote.dialog.showOpenDialog(Electron.remote.getCurrentWindow(), {
      properties: ['openFile'],
      filters: [{ name: '', extensions: ['json'] }],
    })

    if (fileNames) {
      this.props.manager.loadMatch(fileNames[0])
    }
  }

  private saveMatch() {
    const options = {
      filters: [{ name: '', extensions: ['json'] }],
    }
    /* show a file-open dialog and read the first selected file */
    var fileName = Electron.remote.dialog.showSaveDialog(Electron.remote.getCurrentWindow(), options)
    if (fileName) {
      this.props.manager.saveMatch(fileName)
    }
  }

  private onPopupDismissed(dialog: PopupType) {
    this.props.manager.onPopupDismissed(dialog)
  }

  private renderADialog(dialog: PopupType) {
    switch (dialog) {
      case PopupType.About:
        return this.renderAboutDialog()

      case PopupType.NewMatch:
        return this.renderNewMatchDialog()

      case PopupType.AddPlayer:
        return this.renderAddPlayerDialog()

      case PopupType.RemovePlayer:
        return this.renderRemovePlayerDialog()

      case PopupType.EditPlayer:
        return this.renderEditPlayerDialog()

      case PopupType.EditMatch:
        return this.renderEditMatchDialog()

      case PopupType.RemoveAllPlayers:
        return this.renderRemoveAllPlayersDialog()

      default:
        assert.ok(false, `Unknown dialog: ${name}`)
        return
    }
  }

  private renderRemovePlayerDialog() {
    return (
      <RemovePlayer
        key="removeplayer"
        onDismissed={() => {
          this.onPopupDismissed(PopupType.RemovePlayer)
        }}
        manager={this.props.manager}
      />
    )
  }

  private renderRemoveAllPlayersDialog() {
    return (
      <RemoveAllPlayers
        key="removeallplayers"
        onDismissed={() => {
          this.onPopupDismissed(PopupType.RemoveAllPlayers)
        }}
        manager={this.props.manager}
      />
    )
  }

  private renderNewMatchDialog() {
    return (
      <EditMatch
        key="newmatch"
        onDismissed={() => {
          this.onPopupDismissed(PopupType.NewMatch)
        }}
        manager={this.props.manager}
      />
    )
  }

  private renderEditMatchDialog() {
    const match = this.props.manager.getMatch()
    return (
      <EditMatch
        key="editmatch"
        onDismissed={() => {
          this.onPopupDismissed(PopupType.EditMatch)
        }}
        manager={this.props.manager}
        match={match}
      />
    )
  }

  private renderAddPlayerDialog() {
    return this.renderEditPlayerDialog()
  }

  private renderEditPlayerDialog() {
    return (
      <EditPlayer
        key="editplayer"
        onDismissed={() => {
          this.onPopupDismissed(PopupType.EditPlayer)
        }}
        manager={this.props.manager}
      />
    )
  }

  private renderAboutDialog() {
    return (
      <About
        key="about"
        onDismissed={() => {
          this.onPopupDismissed(PopupType.About)
        }}
        applicationName={Electron.remote.app.getName()}
        applicationVersion={Electron.remote.app.getVersion()}
      />
    )
  }

  private renderDialogs() {
    const openDialogs = this.props.manager.getOpenDialogs()
    let ret: any[] = []
    for (let dialog of openDialogs) {
      ret.push(this.renderADialog(dialog))
    }
    return ret
  }

  public render() {
    const printContent = this.props.manager.getPrintContent()
    if (printContent !== undefined) {
      return (
        <div id="xiaogangpao">
          <PrintView manager={this.props.manager} conetent={printContent} />
        </div>
      )
    }

    return (
      <div id="xiaogangpao">
        <MatchView manager={this.props.manager} match={this.props.manager.getMatch()} />
        {this.renderDialogs()}
      </div>
    )
  }
}
