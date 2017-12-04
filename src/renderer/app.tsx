import * as React from 'react'
import * as Electron from 'electron'
import * as assert from 'assert'
import { MenuEvent, sendMenuEvent } from '../common/menu-event'
import { About } from './about'
import { Manager, PopupType } from './manager'
import { EditMatch } from './edit-match'
import { MatchView } from './matchview/match-view'
import { RemovePlayer } from './remove-player'
import { EditPlayer } from './edit-player'
import { RemoveAllPlayers } from './remove-all-players'
import { PrintView } from './print-view'
import { debugLog } from '../common/helper-functions'

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
    debugLog('App constructed')

    Electron.ipcRenderer.on('menu-event', (event: Electron.IpcMessageEvent, { name }: { name: MenuEvent }) => {
      this.onMenuEvent(name)
    })

    Electron.ipcRenderer.on('updateReady', this.onUpdateReady)
  }

  public componentDidMount() {
    this.props.manager.registerApp(this)
  }

  private onUpdateReady = (event: any, text: any) => {
    const options = {
      type: 'info',
      buttons: ['现在升级', '稍后再说'],
      message: '新版本下载完成，现在就升级吗？\n选择稍后升级后，可以在帮助菜单里选择“重启并安装新版本”升级。',
    }
    const response = Electron.remote.dialog.showMessageBox(Electron.remote.getCurrentWindow(), options)
    if (response === 0) {
      sendMenuEvent('quitAndInstall')
    }
  }

  public update() {
    this.setState({})
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
        if (this.props.manager.closeCurrentMatch() === false) {
          return
        }
        return this.props.manager.showPopup(PopupType.NewMatch)

      case 'add-player':
        return this.props.manager.showPopup(PopupType.AddPlayer)

      case 'edit-match':
        return this.props.manager.showPopup(PopupType.EditMatch)

      case 'remove-all-players':
        return this.props.manager.showPopup(PopupType.RemoveAllPlayers)

      case 'file-save':
        return this.props.manager.saveMatch()

      case 'file-open':
        if (this.props.manager.closeCurrentMatch() === false) {
          return
        }
        return this.props.manager.loadMatch()

      case 'file-close':
        return this.props.manager.closeCurrentMatch()

      case 'checkForUpdate':
        Electron.ipcRenderer.send('checkForUpdate')
        return

      case 'quitAndInstall':
        if (this.props.manager.closeCurrentMatch() === false) {
          return
        }
        Electron.ipcRenderer.send('quitAndInstall')
        return

      default:
        return notImplemented(event)
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
    let printView = null
    if (printContent !== undefined) {
      printView = <PrintView manager={this.props.manager} conetent={printContent} />
    }

    return (
      <div id="xiaogangpao">
        <div id="match" hidden={printView !== null}>
          <MatchView manager={this.props.manager} match={this.props.manager.getMatch()} />
        </div>
        {printView}
        {this.renderDialogs()}
      </div>
    )
  }
}
