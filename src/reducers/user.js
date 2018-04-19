// 本地用户
const local = {
  name: 'LOCAL',
  isLocal: true,
  status: 'resolve'
}

const user = (state = local, action) => {
  switch (action.type) {
    // 登录为本地用户
    case 'SET_LOCAL_USER':
      return local
    // 登录为某个在线用户
    case 'SET_USER':
      let meta = {...action}
      delete meta.type
      return meta
    // 注意: 以下操作不可改动status, isLocal等所有基础属性
    // 获取用户歌单
    case 'SET_USER_SONGLIST':
      return {
        ...state,
        ...{songlist: action.songlist}
      }
    default:
      return state
  }
}

export default user
