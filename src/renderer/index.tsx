import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Manager } from './manager'
import { App } from './app'
//import { Modal, Button } from 'react-bootstrap'

// This is the magic trigger for webpack to go compile
// our sass into css and inject it into the DOM.
require('../styles/xiaogangpao.css')

let manager = new Manager()
ReactDOM.render(<App manager={manager} />, document.getElementById('app'))

/*
ReactDOM.render(
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>

      <Modal.Body>One fine body...</Modal.Body>

      <Modal.Footer>
        <Button>Close</Button>
        <Button bsStyle="primary">Save changes</Button>
      </Modal.Footer>
    </Modal.Dialog>
  </div>,
  document.getElementById('app')
)
*/
