import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
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
      <LocaleProvider locale={zhCN}>
        <App />
      </LocaleProvider>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
