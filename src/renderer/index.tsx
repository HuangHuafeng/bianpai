import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Manager } from './manager'
import { App } from './app'
//import { Modal, Button } from 'react-bootstrap'

// This is the magic trigger for webpack to go compile
// our sass into css and inject it into the DOM.
require('../styles/xiaogangpao.css')

/**
 * it seems that in build from 'yarn dist', the window is closed before
 * this function finishes, why?
 */
window.onbeforeunload = ev => {
  const manager = Manager.getManager()
  if (manager.closeCurrentMatch()) {
    return undefined
  } else {
    ev.returnValue = 'shouldnotclose'
    return 'shouldnotclose'
  }
}

ReactDOM.render(<App manager={Manager.getManager()} />, document.getElementById('app'))
