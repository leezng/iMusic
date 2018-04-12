import { combineReducers } from 'redux'
import user from './user'
import searchResult from './searchResult'
import topArtists from './topArtists'
import songlist from './songlist'
import playlist from './playlist'
import playing from './playing'

export default combineReducers({
  user,
  searchResult,
  topArtists,
  songlist,
  playlist,
  playing
})
