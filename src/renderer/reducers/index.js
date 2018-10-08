import { combineReducers } from 'redux'
import user from './user'
import searchResult from './searchResult'
import artists from './artists'
import songlist from './songlist'
import playlist from './playlist'
import playing from './playing'
import djprogram from './djprogram'
import preferences from './preferences'

export default combineReducers({
  user, // 用户
  searchResult, // 搜索结果
  artists, // 所有歌手
  songlist, // 推荐歌单
  playlist, // 播放列表
  playing, // 正在播放的歌曲
  djprogram, // 推荐电台
  preferences // 偏好设置
})
