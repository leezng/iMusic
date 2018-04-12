import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import 'antd/dist/antd.css'
import './assets/less/common.less'
import App from './containers/App'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
window.store = store

render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
