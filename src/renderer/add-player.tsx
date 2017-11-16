import * as React from 'react'
import { Manager } from './manager'
import { Player } from '../common/immutable-player'
import { Alert, Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

interface IAddPlayerProps {
  readonly manager: Manager
  readonly onDismissed: () => void
}

interface IAddPlayerState {
  readonly name: string
  readonly organization: string
}

export class AddPlayer extends React.Component<IAddPlayerProps, IAddPlayerState> {
  constructor(props: IAddPlayerProps) {
    super(props)

    this.state = {
      name: '',
      organization: '',
    }
  }

  private onOK = () => {
    this.props.manager.addPlayer(this.state.name, this.state.organization)
    // don't dismiss the dialog to let the user continue to add new player
    //this.props.onDismissed()
    this.setState({ name: '' })
  }

  private doesNameExist(): Player | undefined {
    const match = this.props.manager.getMatch()
    if (match === undefined) {
      throw new Error('UNEXPECTED! match is undefined')
    }
    return match.getPlayerByName(this.state.name)
  }

  private onNameChanged = (event: any) => {
    this.setState({ name: event.target.value })
  }

  private onOrganizerChanged = (event: any) => {
    this.setState({ organization: event.target.value })
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
        姓名有冲突：已存在编号为"{player.number}"，姓名为"{player.name}"的选手
      </Alert>
    )
  }

  public render() {
    const player = this.doesNameExist()
    const disabled = this.state.name.length === 0 || player !== undefined

    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Header>
          <Modal.Title>增加选手</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderDuplicateWarning(player)}
          <form>
            <FormGroup controlId="name" validationState={this.validateName()}>
              <ControlLabel>姓名</ControlLabel>
              <FormControl type="text" value={this.state.name} onChange={this.onNameChanged} />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="organization">
              <ControlLabel>单位</ControlLabel>
              <FormControl type="text" value={this.state.organization} onChange={this.onOrganizerChanged} />
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={disabled} onClick={this.onOK}>
            增加
          </Button>
          <Button onClick={this.props.onDismissed}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
