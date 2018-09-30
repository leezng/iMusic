import { updateRequestProxy } from 'renderer/api'

// 本地用户
const local = {
  name: 'LOCAL',
  isLocal: true,
  // pending/resolve/reject
  status: 'resolve',
  config: {}
}

const user = (state = local, action) => {
  let result, data
  switch (action.type) {
    // 登录为本地用户
    case 'SET_LOCAL_USER':
      data = {...action}
      delete data.type
      result = {
        ...local,
        ...data
      }
      break

    // 登录为某个在线用户
    case 'SET_USER':
      data = {...action}
      delete data.type
      result = data
      break

    // 注意: 以下操作不可改动status, isLocal等所有基础属性
    // 设置用户配置信息
    case 'SET_USER_CONFIG':
      result = {
        ...state,
        ...{config: action.config}
      }
      break

    // 设置用户歌单
    case 'SET_USER_SONGLIST':
      result = {
        ...state,
        ...{songlist: action.songlist}
      }
      break

    // 设置用户歌单详情
    case 'SET_USER_SONGLIST_DETAIL':
      data = {...state}
      if (!Array.isArray(data.songlist)) data.songlist = []
      data.songlist = data.songlist.map(item => {
        if (item.id === action.id) item.tracks = action.tracks
        return item
      })
      result = data
      break

    default:
      result = state
  }

  const oldId = state.profile && state.profile.userId
  const newId = result.profile && result.profile.userId

  if ((result.config && result.config.proxy) || newId !== oldId) {
    const { url, port } = (result.config && result.config.proxy) || {}
    updateRequestProxy(url, port)
  }

  return result
}

export default user
