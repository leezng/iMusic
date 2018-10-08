import { updateRequestProxy } from 'renderer/api'

const preferences = (state = {}, action) => {
  if (action.type === 'SET_PREFERENCES') {
    // 将代理配置应用到axios中
    if (action.data && action.data.proxy) {
      let { use, url, port } = action.data.proxy
      if (!use) url = ''
      updateRequestProxy(url, port)
    }
    return action.data || {}
  }
  return state
}

export default preferences
