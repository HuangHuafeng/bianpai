import * as React from 'react'
import { Manager } from './manager'
import { Player } from '../common/player'
import { Alert, Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

interface IEditPlayerProps {
  readonly manager: Manager
  readonly onDismissed: () => void
}

interface IEditPlayerState {
  readonly number: string
  readonly name: string
  readonly organization: string
}

export class EditPlayer extends React.Component<IEditPlayerProps, IEditPlayerState> {
  private player: Player

  constructor(props: IEditPlayerProps) {
    super(props)

    let player = this.props.manager.getPlayerToDeleteOrEdit()
    if (player === undefined) {
      throw new Error('UNEXPECTED! there is no player to be edited!')
    }
    this.player = player

    this.state = {
      number: this.player.getNumber().toString(),
      name: this.player.getName(),
      organization: this.player.getOrganization(),
    }
  }

  private onOK = () => {
    let number = this.player.getNumber()
    this.player.setNumber(Number(this.state.number))
    this.player.setName(this.state.name)
    this.player.setOrganization(this.state.organization)

    this.props.manager.updatePlayer(number, this.player)
    this.props.onDismissed()
  }

  private doesNumberExist(): Player | undefined {
    const number = Number(this.state.number)
    if (number === 0) {
      return undefined
    }

    const match = this.props.manager.getMatch()
    if (match === undefined) {
      throw new Error('UNEXPECTED! match is undefined')
    }
    const player = match.getPlayerByNumber(number)
    if (player === undefined) {
      return undefined
    }

    // if the the player under editting
    if (player.getNumber() == this.player.getNumber() && player.getName() == this.player.getName()) {
      return undefined
    }

    return player
  }

  private doesNameExist(): Player | undefined {
    const match = this.props.manager.getMatch()
    if (match === undefined) {
      throw new Error('UNEXPECTED! match is undefined')
    }
    const player = match.getPlayerByName(this.state.name)
    if (player === undefined) {
      return undefined
    }

    // if the the player under editting
    if (player.getNumber() == this.player.getNumber() && player.getName() == this.player.getName()) {
      return undefined
    }

    return player
  }

  private onNumberChanged = (event: any) => {
    const number = Number(event.target.value)
    if (!Number.isNaN(number)) {
      this.setState({ number: number !== 0 ? event.target.value : '' })
    }
  }

  private onNameChanged = (event: any) => {
    this.setState({ name: event.target.value })
  }

  private onOrganizationChanged = (event: any) => {
    this.setState({ organization: event.target.value })
  }

  private validateNumber() {
    if (this.state.number.length !== 0) {
      if (this.doesNumberExist()) {
        return 'error'
      }

      return 'success'
    }

    return undefined
  }

  private validateName() {
    if (this.state.name.length !== 0) {
      if (this.doesNameExist()) {
        return 'error'
      }

      return 'success'
    }

    return undefined
  }

  private renderDuplicateWarning(player: Player | undefined) {
    if (player === undefined) {
      return null
    }

    return (
      <Alert bsStyle="warning">
        编号或姓名有冲突：已存在编号为"{player.getNumber()}"，姓名为"{player.getName()}"的选手
      </Alert>
    )
  }

  private isChanged(): boolean {
    return (
      this.state.name !== this.player.getName() ||
      this.state.organization !== this.player.getOrganization() ||
      this.state.number !== this.player.getNumber().toString()
    )
  }

  public render() {
    const player = this.doesNumberExist() || this.doesNameExist()
    const disabled =
      this.state.name.length === 0 ||
      this.state.number.length === 0 ||
      player !== undefined ||
      this.isChanged() === false

    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Header>
          <Modal.Title>编辑选手</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderDuplicateWarning(player)}
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
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={disabled} onClick={this.onOK}>
            确定
          </Button>
          <Button onClick={this.props.onDismissed}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
