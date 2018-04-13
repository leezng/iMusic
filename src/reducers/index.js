import { combineReducers } from 'redux'
import user from './user'
import searchResult from './searchResult'
import artists from './artists'
import songlist from './songlist'
import playlist from './playlist'
import playing from './playing'

export default combineReducers({
  user,
  searchResult,
  artists,
  songlist,
  playlist,
  playing
})
