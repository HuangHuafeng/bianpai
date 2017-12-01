import * as React from 'react'
import { Manager } from './manager'
import { Modal, Button } from 'react-bootstrap'
import { debugLog } from '../common/helper-functions'

interface IRemoveAllPlayersProps {
  readonly manager: Manager
  readonly onDismissed: () => void
}

interface IRemoveAllPlayersState {}

export class RemoveAllPlayers extends React.Component<IRemoveAllPlayersProps, IRemoveAllPlayersState> {
  constructor(props: IRemoveAllPlayersProps) {
    super(props)
    debugLog('RemoveAllPlayers constructed')
  }

  private onOK = () => {
    this.props.manager.removeAllPlayersConfirmed()
    this.props.onDismissed()
  }

  public render() {
    return (
      <Modal show={true} onHide={this.props.onDismissed} backdrop="static">
        <Modal.Body>
          <h4>确定删除所有选手吗？</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.onOK}>
            确定
          </Button>
          <Button onClick={this.props.onDismissed}>取消</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
