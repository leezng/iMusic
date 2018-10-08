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
import { getCookie } from 'renderer/utils'
import { refreshLogin, setLocalUser, getPreferences } from 'renderer/actions'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)
window.store = store

async function init () {
  const { dispatch } = store
  // 获取偏好设置
  await dispatch(getPreferences())
  // 获取登录状态
  const idCookie = getCookie('__IMUSIC_ID')
  if (idCookie) dispatch(refreshLogin(idCookie))
  else await dispatch(setLocalUser(true))
  return Promise.resolve()
}

init().then(() => {
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
})
