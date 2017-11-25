import * as React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface IAboutProps {
  readonly onDismissed: () => void
  readonly applicationName: string
  readonly applicationVersion: string
}

interface IAboutState {}

export class About extends React.Component<IAboutProps, IAboutState> {
  constructor(props: IAboutProps) {
    super(props)
  }

  public render() {
    const name = this.props.applicationName
    const version = this.props.applicationVersion

    return (
      <Modal show={true} onHide={this.props.onDismissed} bsSize="small">
        <Modal.Header closeButton>
          <Modal.Title>关于{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{name}</p>
          <p>{version}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.props.onDismissed}>
            确定
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
