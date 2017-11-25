import * as React from 'react'
import { Manager } from './manager'
import { Alert, Modal, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { toZeorOrPositiveIntegerString } from '../common/helper-functions'

interface ICreateMatchProps {
  readonly manager: Manager
  readonly onDismissed: () => void
}

interface ICreateMatchState {
  readonly name: string
  readonly organizer: string
  readonly totalRounds: string
}

export class CreateMatch extends React.Component<ICreateMatchProps, ICreateMatchState> {
  constructor(props: ICreateMatchProps) {
    super(props)

    if (__DEV__) {
      this.state = {
        name: '2017年全国象棋锦标赛(个人)',
        organizer: '国家体育总局棋牌运动管理中心、中国象棋协会',
        totalRounds: '7',
      }
    }
  }

  private onOK = () => {
    const totalRounds = Number(this.state.totalRounds)
    this.props.manager.newMatch(this.state.name, totalRounds, this.state.organizer)
    this.props.onDismissed()
  }

  private onNameChanged = (e: any) => {
    this.setState({ name: e.target.value })
  }

  private onOrganizerChanged = (event: any) => {
    this.setState({ organizer: event.target.value })
  }

  private onTotalRoundsChanged = (event: any) => {
    const numberInString = toZeorOrPositiveIntegerString(event.target.value)
    if (numberInString !== undefined) {
      this.setState({ totalRounds: Number(numberInString) !== 0 ? numberInString : '' })
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
