import * as React from 'react'
import { Modal } from 'react-bootstrap'
import { debugLog } from '../common/helper-functions'
import logo from '../../build/icon.png'

interface IAboutProps {
  readonly onDismissed: () => void
  readonly applicationName: string
  readonly applicationVersion: string
}

interface IAboutState {}

export class About extends React.Component<IAboutProps, IAboutState> {
  constructor(props: IAboutProps) {
    super(props)
    debugLog('About constructed')
  }

  public render() {
    const name = this.props.applicationName
    const version = this.props.applicationVersion
    console.log(logo)

    return (
      <Modal show={true} onHide={this.props.onDismissed} bsSize="small">
        <Modal.Body>
          <div id="about-body">
            <img src={logo} />
            <p>{name}</p>
            <p>{version}</p>
            <p>作者：锋大</p>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
