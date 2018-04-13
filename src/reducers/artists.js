const artists = (state = {}, action) => {
  switch (action.type) {
    // 获取热门歌手
    case 'GET_TOP_ARTISTS':
      const oldList = state.result || [] // 已保存在state的所有歌手列表
      const topArtists = action.topArtists || [] // 获取到的热门歌手列表
      let map = {}
      let newList = topArtists.concat(oldList)
      return {
        status: action.status,
        result: newList.reduce((acc, cur) => {
          if (map[cur.id] && cur.detail) {
            let art = acc.find(item => item.id === cur.id) || {}
            art.detail = cur.detail
          } else if (!map[cur.id]) {
            map[cur.id] = 1
            acc.push(cur)
          }
          return acc
        }, [])
      }
    // 添加一位歌手
    case 'ADD_ARTIST':
      return {
        status: action.status,
        result: state.result ? state.result.concat([action.artist]) : [action.artist]
      }
    // 添加歌手详情
    case 'ADD_ARTIST_DETAIL':
      return Object.assign({}, state, {
        status: action.status,
        result: state.result.map(item => {
          if (item.id === action.id) item.detail = action.detail
          return item
        })
      })
    default:
      return state
  }
}

export default artists
