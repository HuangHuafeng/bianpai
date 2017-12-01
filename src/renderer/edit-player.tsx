import * as React from 'react'
import { Manager } from './manager'
import { Player } from '../common/immutable-player'
import { Alert, Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { debugLog, removingHeadingTrailingSpaces, toZeorOrPositiveIntegerString } from '../common/helper-functions'

interface IEditPlayerProps {
  readonly manager: Manager
  readonly onDismissed: () => void
}

interface IEditPlayerState {
  readonly number: string
  readonly name: string
  readonly organization: string
  readonly note: string
}

export class EditPlayer extends React.Component<IEditPlayerProps, IEditPlayerState> {
  private player: Player
  private addOrEdit: string

  constructor(props: IEditPlayerProps) {
    super(props)
    debugLog('EditPlayer constructed')

    this.addOrEdit = 'edit'
    let player = this.props.manager.getPlayerToDeleteOrEdit()
    if (player === undefined) {
      // in this case, the user is adding a new player
      this.addOrEdit = 'add'
      const match = this.props.manager.getMatch()
      const number = match.getQualifiedNumber()
      player = new Player(number, '')
    }
    this.player = player

    this.state = {
      number: this.player.number.toString(),
      name: this.player.name,
      organization: this.player.organization,
      note: this.player.note,
    }
  }

  private onOK = () => {
    if (this.validateName() !== 'success' || this.validateNumber() !== 'success') {
      throw new Error('IMPOSSIBLE!')
    }

    const name = removingHeadingTrailingSpaces(this.state.name)
    const number = Number(this.state.number)
    const organization = removingHeadingTrailingSpaces(this.state.organization)
    const note = removingHeadingTrailingSpaces(this.state.note)

    if (this.addOrEdit === 'edit') {
      this.props.manager.updatePlayer(this.player.number, number, name, organization, note)
    } else {
      this.props.manager.addPlayer(name, organization, note, number)
    }
    this.props.onDismissed()
  }

  private onNumberChanged = (event: any) => {
    const numberInString = toZeorOrPositiveIntegerString(event.target.value)
    if (numberInString !== undefined) {
      this.setState({ number: Number(numberInString) !== 0 ? numberInString : '' })
    }
  }

  private onNameChanged = (event: any) => {
    this.setState({ name: event.target.value })
  }

  private onOrganizationChanged = (event: any) => {
    this.setState({ organization: event.target.value })
  }

  private onNoteChanged = (event: any) => {
    this.setState({ note: event.target.value })
  }

  private validateNumber(): 'success' | 'warning' | 'error' | undefined {
    if (this.state.number.length !== 0) {
      const number = Number(this.state.number)
      const match = this.props.manager.getMatch()
      const player = match.getPlayerByNumber(number)
      if (player !== undefined) {
        // if the same as the player under editting
        if (player.equals(this.player) === false) {
          return 'error'
        }
      }

      return 'success'
    }

    return undefined
  }

  private validateName(): 'success' | 'warning' | 'error' | undefined {
    const match = this.props.manager.getMatch()
    const name = removingHeadingTrailingSpaces(this.state.name)
    if (name.length !== 0) {
      const player = match.getPlayerByName(name)
      if (player !== undefined) {
        // if the same as the player under editting
        if (player.equals(this.player) === false) {
          return 'error'
        }
      }

      return 'success'
    }

    return undefined
  }

  private conflictsWithPlayer(): Player | undefined {
    const match = this.props.manager.getMatch()
    const name = removingHeadingTrailingSpaces(this.state.name)

    const playerWithSameName: Player | undefined = match.getPlayerByName(name)
    if (playerWithSameName && playerWithSameName.equals(this.player) === false) {
      return playerWithSameName
    }

    const playerWithSameNumber: Player | undefined = match.getPlayerByNumber(Number(this.state.number))
    if (playerWithSameNumber && playerWithSameNumber.equals(this.player) === false) {
      return playerWithSameNumber
    }

    return undefined
  }

  private renderDuplicateWarning() {
    const conflictedPlayer = this.conflictsWithPlayer()
    if (conflictedPlayer) {
      return (
        <Alert bsStyle="warning">
          姓名有冲突：已存在编号为"{conflictedPlayer.number}"，姓名为"{conflictedPlayer.name}"的选手
        </Alert>
      )
    }

    return null
  }

  public render() {
    const nameIsInvalid = this.validateName() !== 'success'
    const numberIsInvalid = this.validateNumber() !== 'success'
    const conflictedPlayer = this.conflictsWithPlayer()
    const disabled = nameIsInvalid || numberIsInvalid || conflictedPlayer !== undefined

    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Header>
          <Modal.Title>{this.addOrEdit == 'edit' ? '编辑选手' : '增加选手'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderDuplicateWarning()}
          <form>
            <FormGroup controlId="number" validationState={this.validateNumber()}>
              <ControlLabel>编号</ControlLabel>
              <FormControl type="text" value={this.state.number} onChange={this.onNumberChanged} />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="name" validationState={this.validateName()}>
              <ControlLabel>姓名</ControlLabel>
              <FormControl type="text" value={this.state.name} onChange={this.onNameChanged} />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="organization">
              <ControlLabel>单位</ControlLabel>
              <FormControl type="text" value={this.state.organization} onChange={this.onOrganizationChanged} />
            </FormGroup>
            <FormGroup controlId="note">
              <ControlLabel>备注</ControlLabel>
              <FormControl type="text" value={this.state.note} onChange={this.onNoteChanged} />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" type="submit" disabled={disabled} onClick={this.onOK}>
            确定
          </Button>
          <Button bsStyle="primary" onClick={this.props.onDismissed}>
            取消
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
