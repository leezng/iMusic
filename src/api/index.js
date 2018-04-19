import axios from 'axios'
import artistsApi from './artists'
import songlistApi from './songlist'
import searchApi from './search'
import djprogramApi from './djprogram'
import userApi from './user'

axios.defaults.withCredentials = true // 携带cookie

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api' // 便于代理
}
// else {
//   axios.defaults.baseURL = `http://localhost:${config.server.port}`
// }

export {
  artistsApi,
  songlistApi,
  searchApi,
  djprogramApi,
  userApi
}
