import * as React from 'react'
import { Manager } from './manager'
import { Match } from '../common/match'
import { Alert, Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

interface IEditMatchProps {
  readonly manager: Manager
  readonly match: Match
  readonly onDismissed: () => void
}

interface IEditMatchState {
  readonly name: string
  readonly organizer: string
  readonly totalRounds: string
}

export class EditMatch extends React.Component<IEditMatchProps, IEditMatchState> {
  private match: Match

  constructor(props: IEditMatchProps) {
    super(props)

    const match = this.props.manager.getMatch()
    if (match === undefined) {
      throw new Error('UNEXPECTED! match is undefined')
    }
    this.match = match

    this.state = {
      name: this.match.getName(),
      organizer: this.match.getOrganizer(),
      totalRounds: this.props.match.getTotalRounds() ? this.props.match.getTotalRounds().toString() : '',
    }
  }

  private onOK = () => {
    this.match.setName(this.state.name)
    this.match.setOrganizer(this.state.organizer)
    this.match.setTotalRounds(Number(this.state.totalRounds))
    this.props.manager.updateMatch(this.match)
    this.props.onDismissed()
  }

  private onNameChanged = (e: any) => {
    this.setState({ name: e.target.value })
  }

  private onOrganizerChanged = (event: any) => {
    this.setState({ organizer: event.target.value })
  }

  private onTotalRoundsChanged = (event: any) => {
    const number = Number(event.target.value)
    if (!Number.isNaN(number)) {
      this.setState({ totalRounds: number !== 0 ? event.target.value : '' })
    }
  }

  private validateTotalRounds() {
    if (this.state.totalRounds.length !== 0) {
      const totalRounds = Number(this.state.totalRounds)
      if (totalRounds <= this.props.manager.getMaximumTotalRounds()) {
        return 'success'
      }

      return 'error'
    }

    return undefined
  }

  private renderTooBigTotalRoundsWarning() {
    const totalRounds = Number(this.state.totalRounds)
    if (totalRounds <= this.props.manager.getMaximumTotalRounds()) {
      return null
    }

    return <Alert bsStyle="warning">总轮数太大：最大轮数为{this.props.manager.getMaximumTotalRounds()}</Alert>
  }

  public render() {
    const disabled =
      this.state.name.length === 0 ||
      this.state.totalRounds.length === 0 ||
      Number(this.state.totalRounds) > this.props.manager.getMaximumTotalRounds()

    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Header>
          <Modal.Title>新建比赛</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderTooBigTotalRoundsWarning()}
          <form>
            <FormGroup>
              <ControlLabel>比赛名称</ControlLabel>
              <FormControl type="text" value={this.state.name} onChange={this.onNameChanged} />
            </FormGroup>
            <FormGroup>
              <ControlLabel>主办单位</ControlLabel>
              <FormControl type="text" value={this.state.organizer} onChange={this.onOrganizerChanged} />
            </FormGroup>
            <FormGroup controlId="totalrounds" validationState={this.validateTotalRounds()}>
              <ControlLabel>总轮数</ControlLabel>
              <FormControl type="text" value={this.state.totalRounds} onChange={this.onTotalRoundsChanged} />
              <FormControl.Feedback />
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