import * as React from 'react'
import { Manager } from './manager'
import { Alert, Modal, Button, FormGroup, FormControl, ControlLabel, Form, Col } from 'react-bootstrap'
import { removingHeadingTrailingSpaces, toZeorOrPositiveIntegerString } from '../common/helper-functions'
import { ImmutableMatch } from '../common/immutable-match'

interface IEditMatchProps {
  readonly manager: Manager
  readonly match?: ImmutableMatch
  readonly onDismissed: () => void
}

interface IEditMatchState {
  readonly name: string
  readonly organizer: string
  readonly totalRounds: string
  readonly winScore: string
  readonly loseScore: string
  readonly drawScore: string
  readonly judge: string
  readonly arranger: string
  readonly note: string
}

export class EditMatch extends React.Component<IEditMatchProps, IEditMatchState> {
  private match: ImmutableMatch

  constructor(props: IEditMatchProps) {
    super(props)

    if (props.match) {
      this.match = props.match
    } else {
      this.match = new ImmutableMatch()
      if (__DEV__) {
        this.match = this.match.setName('2017年全国象棋锦标赛(个人)')
        this.match = this.match.setOrganizer('国家体育总局棋牌运动管理中心、中国象棋协会')
        this.match = this.match.setTotalRounds(7)
      }
    }

    this.state = {
      name: this.match.name,
      organizer: this.match.organizer,
      totalRounds: this.match.totalRounds.toString(),
      winScore: this.match.winScore.toString(),
      loseScore: this.match.loseScore.toString(),
      drawScore: this.match.drawScore.toString(),
      judge: this.match.judge,
      arranger: this.match.arranger,
      note: this.match.note,
    }
  }

  private onOK = () => {
    const name = removingHeadingTrailingSpaces(this.state.name)
    const organizer = removingHeadingTrailingSpaces(this.state.organizer)
    const totalRounds = Number(this.state.totalRounds)
    const winScore = Number(this.state.winScore)
    const loseScore = Number(this.state.loseScore)
    const drawScore = Number(this.state.drawScore)
    const judge = removingHeadingTrailingSpaces(this.state.judge)
    const arranger = removingHeadingTrailingSpaces(this.state.arranger)
    const note = removingHeadingTrailingSpaces(this.state.note)

    this.match = this.match.setName(name)
    this.match = this.match.setOrganizer(organizer)
    this.match = this.match.setTotalRounds(totalRounds)
    this.match = this.match.setWinScore(winScore)
    this.match = this.match.setLoseScore(loseScore)
    this.match = this.match.setDrawScore(drawScore)
    this.match = this.match.setJudge(judge)
    this.match = this.match.setArranger(arranger)
    this.match = this.match.setNote(note)

    if (this.props.match) {
      // update match
      this.props.manager.updateMatch(this.match)
    } else {
      // new match
      this.props.manager.newMatch(this.match)
      //this.props.manager.newMatch(this.state.name, totalRounds, this.state.organizer)
    }
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

  private onWinScoreChanged = (event: any) => {
    const numberInString = toZeorOrPositiveIntegerString(event.target.value)
    if (numberInString !== undefined) {
      let value = numberInString
      if (numberInString.length > 0) {
        value = Number(numberInString).toString()
      }
      this.setState({ winScore: value })
    }
  }

  private onLoseScoreChanged = (event: any) => {
    const numberInString = toZeorOrPositiveIntegerString(event.target.value)
    if (numberInString !== undefined) {
      let value = numberInString
      if (numberInString.length > 0) {
        value = Number(numberInString).toString()
      }
      this.setState({ loseScore: value })
    }
  }

  private onDrawScoreChanged = (event: any) => {
    const numberInString = toZeorOrPositiveIntegerString(event.target.value)
    if (numberInString !== undefined) {
      let value = numberInString
      if (numberInString.length > 0) {
        value = Number(numberInString).toString()
      }
      this.setState({ drawScore: value })
    }
  }

  private onJudgeChanged = (e: any) => {
    this.setState({ judge: e.target.value })
  }

  private onArrangerChanged = (e: any) => {
    this.setState({ arranger: e.target.value })
  }

  private onNoteChanged = (e: any) => {
    this.setState({ note: e.target.value })
  }

  private validateTotalRounds() {
    if (this.state.totalRounds.length !== 0) {
      const totalRounds = Number(this.state.totalRounds)
      if (totalRounds > this.props.manager.getMaximumTotalRounds()) {
        return 'error'
      }

      if (totalRounds < this.match.currentRound) {
        return 'error'
      }

      return 'success'
    }

    return undefined
  }

  private validateScoreSettings() {
    if (this.state.winScore.length !== 0 && this.state.drawScore.length !== 0 && this.state.loseScore.length !== 0) {
      return 'success'
    }

    return 'error'
  }

  private renderTooBigTotalRoundsWarning() {
    const totalRounds = Number(this.state.totalRounds)
    let message = ''
    if (totalRounds > this.props.manager.getMaximumTotalRounds()) {
      message = `总轮数太大：最大轮数为${this.props.manager.getMaximumTotalRounds()}`
    } else if (totalRounds < this.match.currentRound) {
      message = `总轮数太小：比赛当前已经进行到了第${this.match.currentRound}轮`
    }

    if (message === '') {
      return null
    } else {
      return <Alert bsStyle="warning">{message}</Alert>
    }
  }

  private renderBasicSetting() {
    return (
      <div>
        <FormGroup controlId="formHorizontalName">
          <Col componentClass={ControlLabel} sm={2}>
            比赛名称
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.name} onChange={this.onNameChanged} />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalOrganizer">
          <Col componentClass={ControlLabel} sm={2}>
            主办单位
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.organizer} onChange={this.onOrganizerChanged} />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalTotalRounds" validationState={this.validateTotalRounds()}>
          <Col componentClass={ControlLabel} sm={2}>
            总轮数
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.totalRounds} onChange={this.onTotalRoundsChanged} />
            <FormControl.Feedback />
          </Col>
        </FormGroup>
      </div>
    )
  }

  private renderScoreSetting() {
    return (
      <div>
        <FormGroup controlId="formHorizontalScoreSetting" validationState={this.validateScoreSettings()}>
          <Col componentClass={ControlLabel} sm={2}>
            赢棋得分
          </Col>
          <Col sm={2}>
            <FormControl type="text" value={this.state.winScore} onChange={this.onWinScoreChanged} />
          </Col>
          <Col componentClass={ControlLabel} sm={2}>
            输棋得分
          </Col>
          <Col sm={2}>
            <FormControl type="text" value={this.state.loseScore} onChange={this.onLoseScoreChanged} />
          </Col>
          <Col componentClass={ControlLabel} sm={2}>
            和棋得分
          </Col>
          <Col sm={2}>
            <FormControl type="text" value={this.state.drawScore} onChange={this.onDrawScoreChanged} />
          </Col>
        </FormGroup>
      </div>
    )
  }

  private renderOtherSetting() {
    return (
      <div>
        <FormGroup controlId="formHorizontalJudge">
          <Col componentClass={ControlLabel} sm={2}>
            裁判长
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.judge} onChange={this.onJudgeChanged} />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalArranger">
          <Col componentClass={ControlLabel} sm={2}>
            编排长
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.arranger} onChange={this.onArrangerChanged} />
          </Col>
        </FormGroup>
        <FormGroup controlId="formHorizontalNote">
          <Col componentClass={ControlLabel} sm={2}>
            备注
          </Col>
          <Col sm={10}>
            <FormControl type="text" value={this.state.note} onChange={this.onNoteChanged} />
          </Col>
        </FormGroup>
      </div>
    )
  }

  public render() {
    const title = this.props.match ? '编辑比赛' : '新建比赛'
    const disabled =
      this.state.name.length === 0 ||
      this.validateTotalRounds() !== 'success' ||
      this.validateScoreSettings() !== 'success'

    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.renderTooBigTotalRoundsWarning()}
          <Form horizontal>
            {this.renderBasicSetting()}
            {this.renderScoreSetting()}
            {this.renderOtherSetting()}
          </Form>
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
