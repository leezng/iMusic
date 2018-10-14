import { updateRequestProxy } from 'renderer/api'

const preferences = (state = {}, action) => {
  if (action.type === 'SET_PREFERENCES') {
    // 保证每一次数据更新都能被监听到
    const data = {...action.data}
    // 将代理配置应用到axios中
    if (data && data.proxy) {
      let { use, url, port } = data.proxy
      if (!use) url = ''
      updateRequestProxy(url, port)
    }
    return data || {}
  }
  return state
}

export default preferences
