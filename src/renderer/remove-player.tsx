import * as React from 'react'
import { Manager } from './manager'
import { Modal, Button } from 'react-bootstrap'

interface IRemovePlayerProps {
  readonly manager: Manager
  readonly onDismissed: () => void
}

interface IRemovePlayerState {}

export class RemovePlayer extends React.Component<IRemovePlayerProps, IRemovePlayerState> {
  constructor(props: IRemovePlayerProps) {
    super(props)
  }

  private onOK = () => {
    const player = this.props.manager.getPlayerToDeleteOrEdit()
    if (player === undefined) {
      throw new Error('UNEXPECTED! there is no player to be removed!')
    }

    this.props.manager.removePlayerConfirmed(player.number)
    this.props.onDismissed()
  }

  public render() {
    const player = this.props.manager.getPlayerToDeleteOrEdit()
    if (player === undefined) {
      throw new Error('UNEXPECTED! there is no player to be removed!')
    }

    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Body>
          <h4>确定删除这位选手吗？</h4>
          编号：{player.number.toString()}
          <br />
          姓名：{player.name}
          <br />
          单位：{player.organization}
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.onOK}>
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
